import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AssessmentState {
  title: string;
  company: string;
  location: string;
  type: string;
  workMode: string;
  questions: Question[];
  description: string;
}

export const TakeAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentState | null>(null);

  useEffect(() => {
    const state = location.state as AssessmentState;
    if (!state) {
      navigate('/dashboard');
      return;
    }
    setAssessmentData(state);
    setSelectedAnswers(new Array(state.questions.length).fill(-1));
  }, [location, navigate]);

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your assessment",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      // Calculate score
      let correctAnswers = 0;
      assessmentData.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      const score = Math.round((correctAnswers / assessmentData.questions.length) * 100);

      // Save result to database
      const { error: submitError } = await supabase
        .from('assessment_results')
        .insert({
          user_id: session.user.id,
          assessment_title: assessmentData.title,
          company_name: assessmentData.company,
          score: score,
          answers: selectedAnswers,
          completed_at: new Date().toISOString()
        });

      if (submitError) throw submitError;

      toast({
        title: "Assessment Completed!",
        description: `You scored ${score}%. View your results on the dashboard.`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit assessment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = assessmentData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{assessmentData.title}</h1>
          <div className="space-y-2">
            <p className="text-lg font-semibold">{assessmentData.company}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{assessmentData.type}</Badge>
              <Badge variant="outline">{assessmentData.workMode}</Badge>
              <Badge variant="outline">{assessmentData.location}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1} of {assessmentData.questions.length}
            </h2>
            <p className="text-sm text-muted-foreground">
              {Math.round(((currentQuestionIndex + 1) / assessmentData.questions.length) * 100)}% Complete
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-lg">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex === assessmentData.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedAnswers.includes(-1)}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Assessment
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TakeAssessment;
