import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Assessment {
  id: string;
  created_at: string;
  job_title: string;
  status: string;
  score?: number;
}

export const RecentActivity = () => {
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch assessments with their results
        const { data: assessments, error } = await supabase
          .from('assessments')
          .select(`
            id,
            created_at,
            job_title,
            assessment_results (
              score,
              status
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Transform the data
        const transformedAssessments = assessments.map(assessment => ({
          id: assessment.id,
          created_at: assessment.created_at,
          job_title: assessment.job_title,
          status: assessment.assessment_results?.[0]?.status || 'pending',
          score: assessment.assessment_results?.[0]?.score
        }));

        setRecentAssessments(transformedAssessments);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading recent assessments...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest assessment activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {recentAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-sm text-muted-foreground">
              <p>No recent assessments found.</p>
              <p>Start a new assessment to see your activity here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{assessment.job_title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {assessment.score !== undefined && (
                      <span className="text-sm font-medium">
                        Score: {assessment.score}%
                      </span>
                    )}
                    {getStatusBadge(assessment.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
