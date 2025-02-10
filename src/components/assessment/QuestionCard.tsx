
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  currentAnswer: number;
  isSubmitted: boolean;
  onAnswerSelect: (questionIndex: number, answerIndex: number) => void;
}

export const QuestionCard = ({
  question,
  questionIndex,
  currentAnswer,
  isSubmitted,
  onAnswerSelect,
}: QuestionCardProps) => {
  return (
    <Card className={isSubmitted ? 'border-2 border-muted' : ''}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Question {questionIndex + 1}: {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentAnswer?.toString()}
          onValueChange={(value) => onAnswerSelect(questionIndex, parseInt(value))}
          disabled={isSubmitted}
        >
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="flex items-center space-x-2">
              <RadioGroupItem value={oIndex.toString()} id={`q${questionIndex}-o${oIndex}`} />
              <label
                htmlFor={`q${questionIndex}-o${oIndex}`}
                className={`text-sm ${
                  isSubmitted &&
                  oIndex === question.correctAnswer &&
                  "text-green-600 font-medium"
                }`}
              >
                {option}
                {isSubmitted && oIndex === question.correctAnswer && (
                  <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-600" />
                )}
              </label>
            </div>
          ))}
        </RadioGroup>
        {isSubmitted && (
          <div className="mt-4 text-sm text-muted-foreground">
            <strong>Explanation:</strong> {question.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
