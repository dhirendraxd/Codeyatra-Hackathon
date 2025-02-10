import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Brain, Users, Clock, Target, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Assessment Creation",
    description: "Generate comprehensive job assessments in seconds using advanced AI technology."
  },
  {
    icon: Users,
    title: "Multi-Format Questions",
    description: "Create diverse assessments with video responses, coding challenges, and multiple-choice questions."
  },
  {
    icon: Clock,
    title: "Real-Time Evaluation",
    description: "Get instant feedback and scoring on candidate responses using AI analysis."
  },
  {
    icon: Target,
    title: "Skill-Based Matching",
    description: "Match candidates to jobs based on their demonstrated skills and assessment performance."
  }
];

export const Features = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAssessment = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an assessment",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://kpjjgzmvchcfnkyssrpe.supabase.co/functions/v1/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          jobDescription: "Software Engineer with expertise in React and TypeScript"
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Assessment Created!",
        description: "Your AI-generated assessment is ready.",
      });
      
      // Navigate to dashboard or assessment view
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center dark:text-[#F5F5F5] text-[#141414]">
          Features That Make Us Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            onClick={scrollToFeatures}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            View Features
          </Button>
          <Button
            onClick={handleCreateAssessment}
            size="lg"
            className="min-w-[200px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Assessment'
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};