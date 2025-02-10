import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Building2, Briefcase, Code2, MapPin, FileText, ArrowLeft, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  companyName: z.string().min(1, "Please enter your company name"),
  jobTitle: z.string().min(1, "Please enter the job title"),
  requiredSkills: z.string().min(1, "Please enter required technical skills"),
  workMode: z.string().min(1, "Please select a work mode"),
  experienceLevel: z.string().min(1, "Please select experience level"),
  jobLocation: z.string().min(1, "Please enter job location"),
  jobDescription: z.string().min(1, "Please provide a job description").max(500, "Job description should not exceed 500 characters"),
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

  const formProgress = () => {
    const fields = Object.keys(form.getValues());
    const filledFields = fields.filter(field => form.getValues(field as any));
    return (filledFields.length / fields.length) * 100;
  };

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
        jobDetails: values
      };

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
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Create SDG Assessment</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Leaf className="h-3 w-3 mr-1" />
                Sustainable Development
              </Badge>
            </div>
            <p className="text-muted-foreground">Generate AI-powered assessments for sustainable development roles</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Card className="border-primary/10">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Fill in the details about the sustainable development position
                </CardDescription>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Form Progress</div>
                <Progress value={formProgress()} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateAssessment)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Company Name
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ANY SDG JOBS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
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
                          <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jobLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Job Location
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiredSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Code2 className="h-4 w-4" />
                          Required Technical Skills
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g.,Microsoft Excel, Google Cloud" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          List the main technical skills required for this position
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Job Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {500 - (field.value?.length || 0)} characters remaining
                        </FormDescription>
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
                      "Create Assessment"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  SDG Focus Areas
                </CardTitle>
                <CardDescription>
                  Key areas for sustainable development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-primary/10">Environmental Protection</Badge>
                  <p className="text-sm text-muted-foreground">
                    Roles focused on environmental conservation and protection
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-primary/10">Social Equity</Badge>
                  <p className="text-sm text-muted-foreground">
                    Positions promoting social justice and equality
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-primary/10">Economic Growth</Badge>
                  <p className="text-sm text-muted-foreground">
                    Jobs supporting sustainable economic development
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Assessment Tips</CardTitle>
                <CardDescription>
                  Creating effective SDG assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary">Job Title</Badge>
                  <p className="text-sm text-muted-foreground">
                    Include SDG-related keywords in the title
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Badge variant="secondary">Skills</Badge>
                  <p className="text-sm text-muted-foreground">
                    Focus on both technical and sustainability skills
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Badge variant="secondary">Description</Badge>
                  <p className="text-sm text-muted-foreground">
                    Highlight sustainability goals and impact
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployerAssessment;
