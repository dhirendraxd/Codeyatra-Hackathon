import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface AssessmentForm {
  companyName: string;
  jobRole: string;
  assessmentTopic: string;
  workMode: "remote" | "hybrid" | "onsite";
  category: "SDG" | "technical";
  customQuestions?: string;
}

export function UploadAssessment() {
  const [formData, setFormData] = useState<AssessmentForm>({
    companyName: "",
    jobRole: "",
    assessmentTopic: "",
    workMode: "remote",
    category: "technical",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateAIAssessment = async () => {
    //place to integrate chapgpt ko api  
    
    return "AI generated questions based on the provided criteria";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let assessmentContent = formData.customQuestions;

      if (!assessmentContent) {
        // ai will auto generate asses if no custom questions provided,
        assessmentContent = await generateAIAssessment();
      }

      const { data, error } = await supabase.from("assessments").insert([
        {
          company_name: formData.companyName,
          job_role: formData.jobRole,
          topic: formData.assessmentTopic,
          work_mode: formData.workMode,
          category: formData.category,
          content: assessmentContent,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Role</label>
            <Input
              name="jobRole"
              value={formData.jobRole}
              onChange={handleInputChange}
              placeholder="Enter job role"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Assessment Topic
            </label>
            <Input
              name="assessmentTopic"
              value={formData.assessmentTopic}
              onChange={handleInputChange}
              placeholder="e.g., React, Sustainability, Leadership"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Work Mode</label>
            <Select
              value={formData.workMode}
              onValueChange={(value) => handleSelectChange("workMode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SDG">SDG</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="ai" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">Use AI Generated Questions</TabsTrigger>
            <TabsTrigger value="custom">Add Custom Questions</TabsTrigger>
          </TabsList>
          <TabsContent value="ai">
            <p className="text-sm text-muted-foreground">
              AI will generate questions based on the provided details above.
            </p>
          </TabsContent>
          <TabsContent value="custom">
            <Textarea
              name="customQuestions"
              value={formData.customQuestions}
              onChange={handleInputChange}
              placeholder="Enter your custom questions here..."
              className="min-h-[200px]"
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Assessment..." : "Create Assessment"}
        </Button>
      </form>
    </Card>
  );
} 