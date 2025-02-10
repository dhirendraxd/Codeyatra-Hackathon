import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Assessment {
  id: string;
  topic: string;
  company_name: string;
  job_title: string;
  assessment_type: string;
  remote_work_type: string;
  green_job_category?: string;
  is_ai_generated: boolean;
  created_at: string;
  questions: any[];
}

export const ActiveAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeAssessment = async (assessment: Assessment) => {
    try {
      // Navigate to the assessment page with the assessment details
      navigate('/create-assessment', {
        state: {
          assessmentId: assessment.id,
          topic: assessment.topic,
          jobDetails: {
            company: assessment.company_name,
            jobTitle: assessment.job_title,
            assessmentType: assessment.assessment_type,
            workMode: assessment.remote_work_type,
            greenJobCategory: assessment.green_job_category
          }
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start assessment",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 dark:text-[#F9F6EE] text-[#36454F]">
          Active Assessments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card 
              key={assessment.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col dark:bg-gray-800"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-[#F9F6EE] text-[#36454F]">
                      {assessment.job_title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Building2 className="w-4 h-4" />
                      <span>{assessment.company_name}</span>
                    </div>
                  </div>
                  <Badge variant={assessment.is_ai_generated ? "secondary" : "default"}>
                    {assessment.assessment_type}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">
                    {assessment.remote_work_type}
                  </Badge>
                  {assessment.green_job_category && (
                    <Badge 
                      variant="outline" 
                      className="bg-green-50 dark:bg-green-900"
                    >
                      <Leaf className="w-3 h-3 mr-1" />
                      {assessment.green_job_category}
                    </Badge>
                  )}
                </div>

                <p className="text-sm mb-6 flex-grow dark:text-gray-300">
                  {assessment.topic}
                </p>

                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleTakeAssessment(assessment)}
                >
                  Take Assessment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
