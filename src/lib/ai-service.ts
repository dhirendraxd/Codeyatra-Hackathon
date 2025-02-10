import { supabase } from "@/integrations/supabase/client";

interface GenerateAssessmentParams {
  topic: string;
  jobTitle: string;
  assessmentType: string;
  skillsDescription: string;
}

export const generateAIAssessment = async (params: GenerateAssessmentParams) => {
  try {
    const response = await supabase.functions.invoke('generate-assessment', {
      body: {
        topic: params.topic,
        jobTitle: params.jobTitle,
        assessmentType: params.assessmentType,
        skillsDescription: params.skillsDescription
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  } catch (error) {
    console.error('Error generating assessment:', error);
    throw error;
  }
}; 