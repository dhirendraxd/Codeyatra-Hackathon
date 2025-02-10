import { supabase } from "@/integrations/supabase/client";

interface AssessmentInput {
  topic: string;
  jobTitle: string;
  assessmentType: string;
  requiredSkills: string;
  companyDescription: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AssessmentOutput {
  questions: Question[];
}

export const generateAIAssessment = async (input: AssessmentInput): Promise<AssessmentOutput> => {
  try {
    // Call Supabase Edge Function instead of direct API call
    const { data, error } = await supabase.functions.invoke('generate-assessment', {
      body: {
        topic: input.topic,
        jobTitle: input.jobTitle,
        assessmentType: input.assessmentType,
        requiredSkills: input.requiredSkills,
        companyDescription: input.companyDescription
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to generate assessment questions');
    }

    if (!data || !data.questions) {
      throw new Error('Invalid response from AI service');
    }

    return data;

  } catch (error) {
    console.warn('Using mock data as AI service failed:', error);
    // Return mock data for development/testing
    return {
      questions: [
        {
          question: `${input.topic}: What is the primary benefit of using TypeScript over JavaScript?`,
          options: [
            "Static type checking",
            "Faster runtime performance",
            "Smaller bundle size",
            "Built-in database integration"
          ],
          correctAnswer: 0,
          explanation: "TypeScript's main advantage is static type checking during development, which helps catch errors before runtime."
        },
        {
          question: `Regarding ${input.jobTitle}: What is the purpose of React's useEffect hook?`,
          options: [
            "To create new components",
            "To handle side effects in functional components",
            "To style components",
            "To route between pages"
          ],
          correctAnswer: 1,
          explanation: "useEffect is used for handling side effects like data fetching, subscriptions, or DOM mutations in React functional components."
        }
      ]
    };
  }
}; 