import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle, Clock, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export const AssessmentStats = () => {
  const [stats, setStats] = useState({
    totalAssessments: 0,
    completedTests: 0,
    highestScore: 0,
    pendingTests: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteHistory = async () => {
    try {
      setIsDeleting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete your assessment history",
          variant: "destructive",
        });
        return;
      }

      // Delete assessment results
      const { error: resultsError } = await supabase
        .from('assessment_results')
        .delete()
        .eq('user_id', session.user.id);

      if (resultsError) throw resultsError;

      // Delete assessments
      const { error: assessmentsError } = await supabase
        .from('assessments')
        .delete()
        .eq('user_id', session.user.id);

      if (assessmentsError) throw assessmentsError;

      // Reset stats
      setStats({
        totalAssessments: 0,
        completedTests: 0,
        highestScore: 0,
        pendingTests: 0,
      });

      toast({
        title: "Assessment history deleted",
        description: "Your assessment history has been successfully cleared.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Assessment Statistics</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting || stats.totalAssessments === 0}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear History
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your assessment history
                including all test results and scores.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteHistory}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete History
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

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
    </div>
  );
};