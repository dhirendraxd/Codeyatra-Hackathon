import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

    navigate("/create-assessment");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto pt-16">
            <div className="text-shadow-lg">
              <img 
                src="/public/favi-uploads/d65dd7d2-7249-4d0b-92f1-01d6c26d28b4.png" 
                alt="Testera Logo" 
                className="w-24 h-24 mx-auto mb-6 animate-glow rounded-xl"
              />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg dark:text-[#F9F6EE] text-[#36454F]">
                Create and Evaluate Job Assessments using AI
              </h1>
              <h2 className="text-xl md:text-2xl mb-8 drop-shadow-lg dark:text-[#F0EAD6] text-[#36454F]">
                Tell us who you want to hire
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-8">
                <Button 
                  size="lg" 
                  className="bg-[#006BFF] hover:bg-[#0055CC] text-white font-semibold shadow-lg whitespace-nowrap h-12"
                  onClick={handleCreateAssessment}
                >
                  Create Assessment
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#006BFF] text-[#006BFF] hover:bg-[#006BFF] hover:text-white font-semibold shadow-lg whitespace-nowrap h-12"
                  onClick={() => navigate("/upload-assessment")}
                >
                  Upload Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};