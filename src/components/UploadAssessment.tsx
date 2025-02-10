import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companySize: z.string(),
  companyIndustry: z.string(),
  companyDescription: z.string().min(50, "Please provide a detailed company description"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  jobLevel: z.string(),
  assessmentTopic: z.string().min(5, "Assessment topic must be at least 5 characters"),
  assessmentType: z.enum(["technical", "sdg", "behavioral"]),
  workMode: z.enum(["remote", "hybrid", "onsite"]),
  greenJobCategory: z.string().optional(),
  requiredSkills: z.string().min(50, "Please provide detailed required skills"),
  experienceLevel: z.string(),
  expectedSalary: z.string().optional(),
  assessmentDuration: z.string(),
  difficultyLevel: z.string(),
});

export function UploadAssessment() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companySize: "medium",
      jobLevel: "mid",
      assessmentType: "technical",
      workMode: "remote",
      experienceLevel: "intermediate",
      assessmentDuration: "60",
      difficultyLevel: "intermediate",
    },
  });

  const generateAIAssessment = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDetails: values }),
      });

      if (!response.ok) throw new Error('Failed to generate assessment');
      const data = await response.json();
      return data.assessment;
    } catch (error) {
      console.error('Error generating assessment:', error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const assessmentContent = await generateAIAssessment(values);
      const { error } = await supabase.from("assessments").insert([
        {
          company_name: values.companyName,
          company_size: values.companySize,
          company_industry: values.companyIndustry,
          company_description: values.companyDescription,
          job_title: values.jobTitle,
          job_level: values.jobLevel,
          topic: values.assessmentTopic,
          assessment_type: values.assessmentType,
          work_mode: values.workMode,
          green_job_category: values.greenJobCategory,
          required_skills: values.requiredSkills,
          experience_level: values.experienceLevel,
          expected_salary: values.expectedSalary,
          assessment_duration: values.assessmentDuration,
          difficulty_level: values.difficultyLevel,
          content: assessmentContent,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      toast({ title: "Success", description: "Assessment created successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Homepage
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Assessment</CardTitle>
          <CardDescription>
            Fill in the details below to generate an AI-powered assessment for your job opening.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="startup">Startup (1-10)</SelectItem>
                            <SelectItem value="small">Small (11-50)</SelectItem>
                            <SelectItem value="medium">Medium (51-200)</SelectItem>
                            <SelectItem value="large">Large (201-500)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (500+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyIndustry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Technology, Healthcare" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyDescription"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your company's mission, culture, and values"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Job Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Job Details</h3>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Add all job-related fields here */}
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
                    name="jobLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="lead">Team Lead</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Assessment Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assessment Configuration</h3>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assessmentDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                            <SelectItem value="120">120 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
  );
} 