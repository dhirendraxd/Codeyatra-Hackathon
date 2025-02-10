
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  topic: z.string().min(1, "Please enter a topic"),
  companyName: z.string().min(1, "Please enter your company name"),
  jobTitle: z.string().min(1, "Please enter the job title"),
  assessmentType: z.string().min(1, "Please select an assessment type"),
  workMode: z.string().min(1, "Please select a work mode"),
  promotes_diversity: z.boolean().optional(),
  green_job_category: z.string().optional(),
  sustainability_focus: z.array(z.string()).optional(),
});

interface AssessmentFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentAnswers: (answers: number[]) => void;
  isTopicLocked?: boolean;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const AssessmentForm = ({ 
  topic, 
  setTopic, 
  setQuestions, 
  setCurrentAnswers,
  isTopicLocked 
}: AssessmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: topic,
      companyName: "",
      jobTitle: "",
      assessmentType: "technical",
      workMode: "on_site",
      promotes_diversity: false,
      green_job_category: "",
      sustainability_focus: [],
    },
  });

  const handleCreateAssessment = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
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

    try {
      const response = await supabase.functions.invoke('generate-assessment', {
        body: { topic: values.topic }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { questions } = response.data;
      setQuestions(questions);
      setCurrentAnswers(new Array(questions.length).fill(-1));

      const { error: dbError } = await supabase
        .from('assessments')
        .insert({
          topic: values.topic,
          questions,
          user_id: session.user.id,
          company_name: values.companyName,
          job_title: values.jobTitle,
          assessment_type: values.assessmentType,
          remote_work_type: values.workMode,
          promotes_diversity: values.promotes_diversity,
          green_job_category: values.green_job_category,
          sustainability_focus: values.sustainability_focus,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Assessment has been generated. Good luck!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateAssessment)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your company name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior React Developer" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Topic</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., React and TypeScript Technical Assessment"
                  {...field}
                  disabled={isTopicLocked}
                />
              </FormControl>
              <FormDescription>
                Describe the skills and knowledge to be assessed
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="on_site">On-site</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="green_job_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Green Job Category (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category if applicable" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="renewable_energy">Renewable Energy</SelectItem>
                  <SelectItem value="sustainable_agriculture">Sustainable Agriculture</SelectItem>
                  <SelectItem value="green_technology">Green Technology</SelectItem>
                  <SelectItem value="environmental_conservation">Environmental Conservation</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Assessment...
            </>
          ) : (
            'Create Assessment'
          )}
        </Button>
      </form>
    </Form>
  );
};
