import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export const UploadAssessmentPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    assessmentTopic: "",
    skillsDescription: "",
    assessmentType: "",
    workMode: "",
    greenJobCategory: "",
    companyDescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate AI assessment
      const aiAssessment = await generateAIAssessment({
        topic: formData.assessmentTopic,
        jobTitle: formData.jobTitle,
        assessmentType: formData.assessmentType,
        skillsDescription: formData.skillsDescription
      });

      // Save to database
      const { data, error } = await supabase
        .from("assessments")
        .insert([
          {
            company_name: formData.companyName,
            job_title: formData.jobTitle,
            topic: formData.assessmentTopic,
            assessment_type: formData.assessmentType,
            remote_work_type: formData.workMode,
            green_job_category: formData.greenJobCategory,
            questions: aiAssessment.questions,
            is_ai_generated: true,
            status: "active",
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
      
      // Redirect to employee page to see the assessment
      navigate("/employee");
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
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create Assessment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>
              <Input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Senior React Developer or SDG Officer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Assessment Topic
              </label>
              <Input
                name="assessmentTopic"
                value={formData.assessmentTopic}
                onChange={handleInputChange}
                placeholder="e.g., React and TypeScript Technical Assessment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Assessment Type
              </label>
              <Select
                value={formData.assessmentType}
                onValueChange={(value) => handleSelectChange("assessmentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="sdg">SDG</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Work Mode
              </label>
              <Select
                value={formData.workMode}
                onValueChange={(value) => handleSelectChange("workMode", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Green Job Category (Optional)
              </label>
              <Select
                value={formData.greenJobCategory}
                onValueChange={(value) => handleSelectChange("greenJobCategory", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category if applicable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renewable_energy">Renewable Energy</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="conservation">Conservation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Required Skills and Knowledge
            </label>
            <Textarea
              name="skillsDescription"
              value={formData.skillsDescription}
              onChange={handleInputChange}
              placeholder="Describe the skills and knowledge to be assessed"
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Description
            </label>
            <Textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleInputChange}
              placeholder="Provide a brief description of your company"
              className="min-h-[100px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Assessment..." : "Create Assessment"}
          </Button>
        </form>
      </Card>
    </div>
  );
};