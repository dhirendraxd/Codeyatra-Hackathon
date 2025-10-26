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

  const handleEmployerAssessment = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an employer assessment",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    navigate("/create-employer-assessment");
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden dark:bg-background bg-white">
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-24">
        <div className="flex flex-col items-center gap-8">
          <div className="text-shadow-lg max-w-4xl">
            <img 
              src="/uploads/d65dd7d2-7249-4d0b-92f1-01d6c26d28b4.png" 
              alt="Testera Logo" 
              className="w-32 h-32 mx-auto mb-8 rounded-xl"
            />
            <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg dark:text-[#F9F6EE] text-[#36454F]">
              Create and Evaluate Job Assessments using AI
            </h1>
            {/* <h2 className="text-xl md:text-2xl mb-6 drop-shadow-lg dark:text-[#F0EAD6] text-[#36454F]">
              Tell us who you want to hire
            </h2> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-8">
              
              <Button 
                size="lg" 
                className="bg-[#006BFF] hover:bg-[#0055CC] text-white font-semibold shadow-lg whitespace-nowrap h-12"
                onClick={handleCreateAssessment}
              >
               
                Give Assessment
              </Button>
              <Button 
                size="lg" 
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold shadow-lg whitespace-nowrap h-12"
                onClick={handleEmployerAssessment}
              >
                Create Job Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};