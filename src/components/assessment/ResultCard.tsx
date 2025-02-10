
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ResultCardProps {
  score: number;
}

export const ResultCard = ({ score }: ResultCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Complete!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">Your score: <span className="font-bold">{score}%</span></p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          View Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};
