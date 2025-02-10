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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  companyName: z.string().min(1, "Please enter your company name"),
  jobTitle: z.string().min(1, "Please enter the job title"),
  requiredSkills: z.string().min(1, "Please enter required technical skills"),
  workMode: z.string().min(1, "Please select a work mode"),
  experienceLevel: z.string().min(1, "Please select experience level"),
  jobLocation: z.string().min(1, "Please enter job location"),
  jobDescription: z.string().min(1, "Please provide a job description"),
});

export const CreateEmployerAssessment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      requiredSkills: "",
      workMode: "on_site",
      experienceLevel: "mid",
      jobLocation: "",
      jobDescription: "",
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
      // Generate assessment based on job requirements
      const response = await supabase.functions.invoke('generate-assessment', {
        body: { 
          skills: values.requiredSkills,
          jobTitle: values.jobTitle,
          experienceLevel: values.experienceLevel
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { questions } = response.data;

      // Save assessment to database
      const { data: assessment, error: dbError } = await supabase
        .from('employer_assessments')
        .insert({
          company_name: values.companyName,
          job_title: values.jobTitle,
          required_skills: values.requiredSkills,
          work_mode: values.workMode,
          experience_level: values.experienceLevel,
          job_location: values.jobLocation,
          job_description: values.jobDescription,
          questions: questions,
          user_id: session.user.id,
          status: 'active'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Assessment has been created and is now available for candidates.",
      });
      
      // Open the generated assessment in a new tab
      const assessmentData = {
        questions,
        jobDetails: {
          companyName: values.companyName,
          jobTitle: values.jobTitle,
          requiredSkills: values.requiredSkills,
          workMode: values.workMode,
          experienceLevel: values.experienceLevel,
          jobLocation: values.jobLocation,
          jobDescription: values.jobDescription,
        }
      };

      // Create a new window with the assessment data
      const newWindow = window.open('/view-generated-assessment', '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.postMessage({ type: 'ASSESSMENT_DATA', data: assessmentData }, window.location.origin);
        };
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-[#F9F6EE] text-[#36454F]">
          Create Job Assessment
        </h1>
        
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
              name="requiredSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Technical Skills</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., React, TypeScript, Node.js, AWS" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    List the main technical skills required for this position
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Manager</SelectItem>
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
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New York, NY" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed job description and requirements..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Assessment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateEmployerAssessment;
