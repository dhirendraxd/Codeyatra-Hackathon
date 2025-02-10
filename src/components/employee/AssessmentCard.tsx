
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Clock, MapPin, Leaf, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentCardProps {
  assessment: {
    title: string;
    company: string;
    location: string;
    type: string;
    workMode: string;
    tags: string[];
    description: string;
    isNew: boolean;
    sustainability_focus?: string[];
    promotes_diversity?: boolean;
    remote_work_type?: string;
    green_job_category?: string;
  };
  onAssessmentClick: (assessment: AssessmentCardProps['assessment']) => void;
}

export const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
  const navigate = useNavigate();

  const handleAssessmentClick = () => {
    navigate('/create-assessment', { 
      state: { 
        topic: assessment.title,
        companyName: assessment.company,
        jobTitle: assessment.title,
        assessmentType: assessment.type,
        workMode: assessment.workMode,
        sustainability_focus: assessment.sustainability_focus,
        promotes_diversity: assessment.promotes_diversity,
        green_job_category: assessment.green_job_category,
        isTopicLocked: true
      } 
    });
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl dark:text-[#F9F6EE] text-[#36454F]">
            {assessment.title}
          </CardTitle>
          <div className="flex gap-2">
            {assessment.isNew && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100">
                New
              </Badge>
            )}
            {assessment.green_job_category && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Leaf className="w-3 h-3 mr-1" />
                Green Job
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm dark:text-[#E2DFD2] text-[#36454F]">
          <Building2 size={16} />
          <span>{assessment.company}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {assessment.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" className="dark:text-[#F0EAD6]">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm dark:text-[#E2DFD2] text-[#36454F]">
              <MapPin size={16} />
              <span>{assessment.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm dark:text-[#E2DFD2] text-[#36454F]">
              <Clock size={16} />
              <span>{assessment.type} • {assessment.workMode}</span>
            </div>
            {assessment.promotes_diversity && (
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <Users size={16} />
                <span>Diversity-focused position</span>
              </div>
            )}
            {assessment.remote_work_type === 'remote' && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Globe size={16} />
                <span>Remote position - Reduce carbon footprint</span>
              </div>
            )}
          </div>
          
          <p className="text-sm dark:text-[#E2DFD2] text-[#36454F] line-clamp-3">
            {assessment.description}
          </p>

          {assessment.sustainability_focus && assessment.sustainability_focus.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {assessment.sustainability_focus.map((focus, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  {focus.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAssessmentClick}
          className="w-full bg-[#36454F] hover:bg-[#2A363F] text-white"
        >
          Give Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};
