
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentList } from "./AssessmentList";
import { AssessmentHeader } from "./AssessmentHeader";

const assessments = [
  {
    title: "Junior Production Manager",
    company: "Test2",
    location: "[City Name]",
    type: "Full time",
    workMode: "Fully On-site",
    tags: ["Production management", "Quality control", "Team coordination"],
    description: "We are seeking a motivated Junior Production Manager to join our dynamic team at an aluminium flat rolled products factory. In this role, you will assist in overseeing the production process, ensuring efficiency and adherence to company standards. You will work closely with senior...",
    isNew: true,
    sustainability_focus: ["waste_management", "circular_economy"],
    promotes_diversity: true,
    remote_work_type: "on_site",
    green_job_category: "manufacturing"
  },
  {
    title: "Renewable Energy Systems Engineer",
    company: "Test2",
    location: "Remote",
    type: "Full time",
    workMode: "Remote",
    tags: ["Renewable Energy", "Solar Systems", "Green Technology"],
    description: "Join our team as a Renewable Energy Systems Engineer and help design the sustainable energy solutions of tomorrow. You'll work on cutting-edge solar and wind energy projects while contributing to a greener future...",
    isNew: true,
    sustainability_focus: ["renewable_energy", "green_technology"],
    promotes_diversity: true,
    remote_work_type: "remote",
    green_job_category: "renewable_energy"
  },
  {
    title: "UI/UX Expert",
    company: "Test2",
    location: "Bangalore, India",
    type: "Full time",
    workMode: "Hybrid",
    tags: ["UI Design", "UX Design", "User Research"],
    description: "We are seeking a talented UI/UX Expert to join our dynamic startup in Bangalore. The ideal candidate will have a strong background in user interface design and user experience optimization. You will be responsible for creating intuitive and engaging interfaces for our web and...",
    isNew: true
  },
  {
    title: "Junior Financial Analyst",
    company: "Test2",
    location: "Delhi, India",
    type: "Full time",
    workMode: "Fully On-site",
    tags: ["Financial Analysis", "Excel", "Data Analysis"],
    description: "We are seeking a detail-oriented Junior Financial Analyst to join our consulting firm in Delhi. The ideal candidate will assist in financial analysis, reporting, and forecasting activities. You will work closely with senior analysts to prepare financial models and...",
    isNew: false
  },
  {
    title: "Software Developer",
    company: "Test2",
    location: "Mumbai, India",
    type: "Full time",
    workMode: "Remote",
    tags: ["JavaScript", "React", "Node.js"],
    description: "Join our growing team as a Software Developer and help build cutting-edge web applications. The ideal candidate will have strong experience with modern JavaScript frameworks and a passion for clean, maintainable code...",
    isNew: true
  },
  {
    title: "Marketing Manager",
    company: "Test2",
    location: "Chennai, India",
    type: "Full time",
    workMode: "Hybrid",
    tags: ["Digital Marketing", "Brand Management", "Analytics"],
    description: "We're looking for an experienced Marketing Manager to lead our marketing initiatives. The successful candidate will develop and execute marketing strategies, manage campaigns, and analyze market trends...",
    isNew: false
  },
  {
    title: "Data Scientist",
    company: "Test2",
    location: "Pune, India",
    type: "Full time",
    workMode: "Hybrid",
    tags: ["Machine Learning", "Python", "Data Analysis"],
    description: "Join our data science team to help derive insights from complex datasets. The ideal candidate will have experience with machine learning algorithms, statistical analysis, and data visualization...",
    isNew: true
  },
  {
    title: "HR Manager",
    company: "Test2",
    location: "Hyderabad, India",
    type: "Full time",
    workMode: "On-site",
    tags: ["Recruitment", "Employee Relations", "HR Policy"],
    description: "We are seeking an experienced HR Manager to oversee all aspects of human resources management. The successful candidate will handle recruitment, employee relations, policy development, and more...",
    isNew: false
  },
  {
    title: "Product Manager",
    company: "Test2",
    location: "Kolkata, India",
    type: "Full time",
    workMode: "Remote",
    tags: ["Product Strategy", "Agile", "User Experience"],
    description: "Join us as a Product Manager to help shape the future of our products. You'll work closely with development teams, stakeholders, and users to define product strategy and roadmap...",
    isNew: true
  },
  {
    title: "Sales Executive",
    company: "Test2",
    location: "Ahmedabad, India",
    type: "Full time",
    workMode: "Hybrid",
    tags: ["B2B Sales", "Client Relations", "Negotiation"],
    description: "We're looking for a dynamic Sales Executive to join our growing team. The ideal candidate will have experience in B2B sales, strong communication skills, and a track record of meeting sales targets...",
    isNew: false
  }
];

export const ActiveAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAssessment = async (assessment: typeof assessments[0]) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to take the assessment",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Automatically create an AI-generated assessment for this job
    const { data: existingAssessment, error: fetchError } = await supabase
      .from('assessments')
      .select()
      .eq('user_id', session.user.id)
      .eq('topic', assessment.title)
      .eq('company_name', assessment.company)
      .maybeSingle();

    if (fetchError) {
      toast({
        title: "Error",
        description: "Failed to check existing assessments",
        variant: "destructive",
      });
      return;
    }

    if (existingAssessment) {
      toast({
        title: "Assessment Exists",
        description: "You have already taken or started this assessment",
      });
      navigate("/create-assessment", {
        state: { 
          topic: assessment.title,
          jobDetails: {
            company: assessment.company,
            location: assessment.location,
            type: assessment.type,
            workMode: assessment.workMode,
            sustainability_focus: assessment.sustainability_focus,
            promotes_diversity: assessment.promotes_diversity,
            remote_work_type: assessment.remote_work_type,
            green_job_category: assessment.green_job_category
          }
        }
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('generate-assessment', {
        body: { topic: assessment.title }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { questions } = response.data;

      const { data: newAssessment, error: createError } = await supabase
        .from('assessments')
        .insert({
          topic: assessment.title,
          questions,
          user_id: session.user.id,
          company_name: assessment.company,
          job_title: assessment.title,
          assessment_type: "technical",
          is_ai_generated: true,
          remote_work_type: assessment.remote_work_type,
          promotes_diversity: assessment.promotes_diversity,
          green_job_category: assessment.green_job_category,
          sustainability_focus: assessment.sustainability_focus,
        })
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: "Assessment Created",
        description: "Your assessment has been generated. Good luck!",
      });

      navigate("/create-assessment", {
        state: { 
          topic: assessment.title,
          jobDetails: {
            company: assessment.company,
            location: assessment.location,
            type: assessment.type,
            workMode: assessment.workMode,
            sustainability_focus: assessment.sustainability_focus,
            promotes_diversity: assessment.promotes_diversity,
            remote_work_type: assessment.remote_work_type,
            green_job_category: assessment.green_job_category
          }
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate assessment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-16 px-4 md:px-8">
      <AssessmentHeader 
        title="Currently Active Assessments" 
        subtitle="Including sustainable and inclusive job opportunities"
      />
      <AssessmentList 
        assessments={assessments}
        onAssessmentClick={handleAssessment}
      />
    </div>
  );
};
