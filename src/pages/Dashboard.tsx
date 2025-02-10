import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { LogOut, Home, Leaf, Plus } from "lucide-react";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { AssessmentStats } from "@/components/dashboard/AssessmentStats";
import { AssessmentTable } from "@/components/dashboard/AssessmentTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        setUser(user);
      } catch (error: any) {
        toast({
          title: "Error fetching user data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">SDG Assessment Dashboard</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Leaf className="h-3 w-3 mr-1" />
                Sustainable Development
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/create-assessment">
                <Plus className="h-4 w-4" />
                New Assessment
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          {user && <ProfileSection user={user} />}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                SDG Impact
              </CardTitle>
              <CardDescription>
                Your contribution to sustainable development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Green Assessments Created</span>
                  <Badge variant="outline" className="bg-primary/10">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sustainable Skills Assessed</span>
                  <Badge variant="outline" className="bg-primary/10">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Environmental Impact Score</span>
                  <Badge variant="outline" className="bg-primary/10">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <AssessmentStats />
            <RecentActivity />
          </div>
          <AssessmentTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
