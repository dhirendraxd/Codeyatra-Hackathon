
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Assessment {
  id: string;
  topic: string;
  company_name: string | null;
  job_title: string | null;
  assessment_type: string | null;
  is_ai_generated: boolean;
  created_at: string;
  score: number;
  company_selection_status?: string;
  selection_message?: string;
}

export const AssessmentTable = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: assessmentsData, error: assessmentsError } = await supabase
          .from('assessments')
          .select(`
            *,
            assessment_results (
              score,
              completed_at,
              company_selection_status,
              selection_message
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (assessmentsError) throw assessmentsError;

        const formattedAssessments = assessmentsData.map((assessment: any) => ({
          ...assessment,
          score: assessment.assessment_results?.[0]?.score || 0,
          company_selection_status: assessment.assessment_results?.[0]?.company_selection_status || 'pending',
          selection_message: assessment.assessment_results?.[0]?.selection_message
        }));

        setAssessments(formattedAssessments);

        // Check for any selection updates and show notifications
        formattedAssessments.forEach((assessment) => {
          if (assessment.company_selection_status === 'selected' && assessment.selection_message) {
            toast({
              title: "Congratulations! 🎉",
              description: `You've been selected for an interview at ${assessment.company_name}: ${assessment.selection_message}`,
            });
          }
        });
      } catch (error: any) {
        toast({
          title: "Error fetching assessments",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();

    // Set up real-time subscription for selection status updates
    const channel = supabase
      .channel('assessment-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assessment_results',
        },
        (payload) => {
          fetchAssessments(); // Refresh data when updates occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading assessments...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell>{assessment.topic}</TableCell>
              <TableCell>
                <Badge variant={assessment.is_ai_generated ? "secondary" : "default"}>
                  {assessment.is_ai_generated ? "AI Generated" : "Company"}
                </Badge>
              </TableCell>
              <TableCell>{assessment.company_name || "N/A"}</TableCell>
              <TableCell>{assessment.job_title || "N/A"}</TableCell>
              <TableCell>
                {format(new Date(assessment.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Badge variant={assessment.score >= 70 ? "default" : "destructive"}>
                  {assessment.score}%
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    assessment.company_selection_status === 'selected' 
                      ? "default" 
                      : assessment.company_selection_status === 'rejected'
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {assessment.company_selection_status === 'selected' 
                    ? "Selected for Interview" 
                    : assessment.company_selection_status === 'rejected'
                      ? "Not Selected"
                      : "Pending Review"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
