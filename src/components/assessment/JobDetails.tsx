
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, Globe } from "lucide-react";

interface JobDetailsProps {
  topic: string;
  jobDetails: {
    company: string;
    location: string;
    type: string;
    workMode: string;
    sustainability_focus?: string[];
    promotes_diversity?: boolean;
    remote_work_type?: string;
    green_job_category?: string;
  };
}

export const JobDetails = ({ topic, jobDetails }: JobDetailsProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{topic}</CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{jobDetails.company}</Badge>
            <Badge variant="outline">{jobDetails.location}</Badge>
            <Badge variant="outline">{jobDetails.type}</Badge>
            <Badge variant="outline">{jobDetails.workMode}</Badge>
            
            {jobDetails.promotes_diversity && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                <Users className="w-3 h-3 mr-1" />
                Diversity Focus
              </Badge>
            )}
            
            {jobDetails.remote_work_type === 'remote' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                <Globe className="w-3 h-3 mr-1" />
                Remote Work
              </Badge>
            )}
            
            {jobDetails.green_job_category && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <Leaf className="w-3 h-3 mr-1" />
                {jobDetails.green_job_category.replace('_', ' ')}
              </Badge>
            )}
          </div>
          
          {jobDetails.sustainability_focus && jobDetails.sustainability_focus.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {jobDetails.sustainability_focus.map((focus, index) => (
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
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
