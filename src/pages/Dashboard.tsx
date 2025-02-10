
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { LogOut, Home } from "lucide-react";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { AssessmentStats } from "@/components/dashboard/AssessmentStats";
import { AssessmentTable } from "@/components/dashboard/AssessmentTable";

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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <Button variant="ghost" asChild>
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {user && <ProfileSection user={user} />}
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
            <AssessmentStats />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Assessment History</h2>
            <AssessmentTable />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <Link to="/employee">Browse Jobs</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/create-assessment">Generate AI Assessment</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <p className="text-muted-foreground">Track your recent assessment activities and progress.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
