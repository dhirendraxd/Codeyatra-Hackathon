import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateAIAssessment } from "@/lib/ai-service";    
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  assessmentTopic: z.string().min(5, "Assessment topic must be at least 5 characters"),
  assessmentType: z.enum(["technical", "sdg", "behavioral"]),
  workMode: z.enum(["remote", "hybrid", "onsite"]),
  greenJobCategory: z.string().optional(),
  requiredSkills: z.string().min(50, "Please provide detailed required skills"),
  companyDescription: z.string().min(50, "Please provide a detailed company description"),
});

export const UploadAssessmentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentType: "technical",
      workMode: "remote",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Generate AI assessment
      const aiAssessment = await generateAIAssessment({
        topic: values.assessmentTopic,
        jobTitle: values.jobTitle,
        assessmentType: values.assessmentType,
        requiredSkills: values.requiredSkills,
        companyDescription: values.companyDescription
      });

      if (!aiAssessment || !aiAssessment.questions) {
        throw new Error('Failed to generate questions');
      }

      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create an assessment');
      }

      // Save to database
      const { data, error } = await supabase
        .from("assessments")
        .insert([
          {
            user_id: session.user.id,
            company_name: values.companyName,
            job_title: values.jobTitle,
            topic: values.assessmentTopic,
            assessment_type: values.assessmentType,
            work_mode: values.workMode,
            green_job_category: values.greenJobCategory,
            required_skills: values.requiredSkills,
            company_description: values.companyDescription,
            questions: aiAssessment.questions,
            is_ai_generated: true,
            status: "active",
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
      
      // Redirect to employee page to see the assessment
      navigate("/employee");
    } catch (error: any) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create assessment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create Assessment</CardTitle>
            <CardDescription>
              Fill in the details below to generate an AI-powered assessment for your job opening.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name" {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Topic</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., React and TypeScript Technical Assessment" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="sdg">SDG</SelectItem>
                            <SelectItem value="behavioral">Behavioral</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="onsite">Onsite</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="greenJobCategory"
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
                          <SelectItem value="sustainability">Sustainability</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="conservation">Conservation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills and Knowledge</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the skills and knowledge to be assessed"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a brief description of your company"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};