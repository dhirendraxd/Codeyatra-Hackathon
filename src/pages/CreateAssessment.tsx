import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { AssessmentForm } from "@/components/assessment/AssessmentForm";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { JobDetails } from "@/components/assessment/JobDetails";
import { ResultCard } from "@/components/assessment/ResultCard";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LocationState {
  topic: string;
  jobDetails: {
    company: string;
    location: string;
    type: string;
    workMode: string;
  };
}

const CreateAssessment = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [topic, setTopic] = useState(state?.topic || "");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const staticQuestions = [
    {
      question: "Which of the following is a key responsibility in waste management within aluminum production?",
      options: [
        "Maximizing waste generation to increase production speed",
        "Implementing scrap metal recycling and recovery systems",
        "Ignoring waste byproducts to focus on main production",
        "Storing all waste materials indefinitely"
      ],
      correctAnswer: 1,
      explanation: "In aluminum production, implementing scrap metal recycling and recovery systems is crucial for waste management and sustainability."
    },
    {
      question: "What is a critical aspect of quality control in aluminum flat rolled products?",
      options: [
        "Only checking the final product",
        "Visual inspection without measurements",
        "Continuous monitoring of thickness, flatness, and surface quality",
        "Relying solely on customer feedback"
      ],
      correctAnswer: 2,
      explanation: "Continuous monitoring of thickness, flatness, and surface quality is essential for maintaining product standards in aluminum production."
    },
    {
      question: "In the context of circular economy, what is the best approach to handling aluminum production byproducts?",
      options: [
        "Dispose of all byproducts immediately",
        "Store byproducts indefinitely",
        "Reintegrate byproducts into the production cycle when possible",
        "Sell all byproducts at a discount"
      ],
      correctAnswer: 2,
      explanation: "Circular economy principles emphasize reintegrating byproducts into the production cycle to minimize waste and maximize resource efficiency."
    },
    {
      question: "Which team coordination practice is most effective in a production environment?",
      options: [
        "Working independently without communication",
        "Regular shift handover meetings and clear communication channels",
        "Informal verbal updates only",
        "Annual team meetings"
      ],
      correctAnswer: 1,
      explanation: "Regular shift handover meetings and clear communication channels ensure smooth operations and maintain production standards."
    },
    {
      question: "What is a key principle of production management in an aluminum factory?",
      options: [
        "Focusing only on output quantity",
        "Maintaining a balance between quality, efficiency, and safety",
        "Minimizing all costs regardless of impact",
        "Maximizing worker overtime"
      ],
      correctAnswer: 1,
      explanation: "Effective production management requires balancing quality, efficiency, and safety to ensure sustainable operations."
    }
  ];

  useEffect(() => {
    // Set static questions when component mounts
    if (state?.topic === "Junior Production Manager") {
      setQuestions(staticQuestions);
      setCurrentAnswers(new Array(staticQuestions.length).fill(-1));
    }
  }, [state]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setCurrentAnswers(newAnswers);
  };

  const calculateScore = async () => {
    const totalQuestions = questions.length;
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      if (currentAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setIsSubmitted(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: assessment } = await supabase
      .from('assessments')
      .select('id')
      .eq('topic', topic)
      .eq('user_id', session.user.id)
      .single();

    if (assessment) {
      await supabase
        .from('assessment_results')
        .insert({
          user_id: session.user.id,
          assessment_id: assessment.id,
          score: finalScore,
          answers: currentAnswers,
        });
    }

    toast({
      title: "Assessment Completed!",
      description: `You scored ${finalScore}%. View your results on the dashboard.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        {state?.jobDetails && (
          <JobDetails topic={state.topic} jobDetails={state.jobDetails} />
        )}

        <h1 className="text-3xl font-bold mb-8 text-center dark:text-[#F9F6EE] text-[#36454F]">
          {questions.length ? 'Assessment Questions' : 'AI Made Assessment'}
        </h1>
        
        {!questions.length ? (
          <AssessmentForm
            topic={topic}
            setTopic={setTopic}
            setQuestions={setQuestions}
            setCurrentAnswers={setCurrentAnswers}
            isTopicLocked={!!state?.topic}
          />
        ) : (
          <div className="space-y-8">
            {questions.map((question, qIndex) => (
              <QuestionCard
                key={qIndex}
                question={question}
                questionIndex={qIndex}
                currentAnswer={currentAnswers[qIndex]}
                isSubmitted={isSubmitted}
                onAnswerSelect={handleAnswerSelect}
              />
            ))}

            {!isSubmitted && (
              <Button
                onClick={calculateScore}
                disabled={currentAnswers.includes(-1)}
                className="w-full"
              >
                Submit Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {isSubmitted && <ResultCard score={score} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAssessment;
