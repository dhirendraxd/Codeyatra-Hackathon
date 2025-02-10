import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AssessmentStats = () => {
  const [stats, setStats] = useState({
    totalAssessments: 0,
    completedTests: 0,
    highestScore: 0,
    pendingTests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: assessments } = await supabase
        .from('assessments')
        .select('id')
        .eq('user_id', session.user.id);

      const { data: results } = await supabase
        .from('assessment_results')
        .select('score')
        .eq('user_id', session.user.id);

      const totalAssessments = assessments?.length || 0;
      const completedTests = results?.length || 0;
      const highestScore = results?.reduce((max, result) => 
        Math.max(max, result.score), 0) || 0;
      const pendingTests = Math.max(0, totalAssessments - completedTests);

      setStats({
        totalAssessments,
        completedTests,
        highestScore,
        pendingTests,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAssessments}</div>
          <p className="text-xs text-muted-foreground">Assessments taken</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.highestScore}%</div>
          <p className="text-xs text-muted-foreground">Best performance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedTests}</div>
          <p className="text-xs text-muted-foreground">Tests completed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingTests}</div>
          <p className="text-xs text-muted-foreground">Tests in progress</p>
        </CardContent>
      </Card>
    </div>
  );
};