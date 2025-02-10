import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface AssessmentData {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  jobDetails: {
    companyName: string;
    jobTitle: string;
    requiredSkills: string;
    workMode: string;
    experienceLevel: string;
    jobLocation: string;
    jobDescription: string;
  };
}

export const ViewGeneratedAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && 
          event.data.type === 'ASSESSMENT_DATA') {
        setAssessmentData(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const data = location.state as AssessmentData;
    if (data) {
      setAssessmentData(data);
    }
  }, [location]);

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">No assessment data available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{assessmentData.jobDetails.jobTitle} Assessment</h1>
          <div className="space-y-2">
            <p className="text-lg font-semibold">{assessmentData.jobDetails.companyName}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{assessmentData.jobDetails.experienceLevel} Level</Badge>
              <Badge variant="outline">{assessmentData.jobDetails.workMode}</Badge>
              <Badge variant="outline">{assessmentData.jobDetails.jobLocation}</Badge>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Required Skills:</p>
              <p>{assessmentData.jobDetails.requiredSkills}</p>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Job Description:</p>
              <p className="whitespace-pre-wrap">{assessmentData.jobDetails.jobDescription}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {assessmentData.questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              questionIndex={index}
              currentAnswer={-1}
              isSubmitted={false}
              onAnswerSelect={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewGeneratedAssessment;
