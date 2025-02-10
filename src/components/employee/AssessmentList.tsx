
import { Link } from "react-router-dom";
import { AssessmentCard } from "./AssessmentCard";

interface Assessment {
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
}

interface AssessmentListProps {
  assessments: Assessment[];
  onAssessmentClick: (assessment: Assessment) => void;
}

export const AssessmentList = ({ assessments, onAssessmentClick }: AssessmentListProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {assessments.map((assessment, index) => (
          <AssessmentCard
            key={index}
            assessment={assessment}
            onAssessmentClick={onAssessmentClick}
          />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          to="/assessments" 
          className="text-sm font-medium hover:underline dark:text-[#F0EAD6] text-[#36454F]"
        >
          Browse all assessments
        </Link>
      </div>
    </>
  );
};
