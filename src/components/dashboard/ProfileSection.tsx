import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { Camera, UserIcon, Mail, BadgeCheck, Loader2, Calendar, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import debounce from 'lodash/debounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const ProfileSection = ({ user }: { user: User }) => {
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [profileProgress, setProfileProgress] = useState(0);
  const { toast } = useToast();

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setFullName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url);
        let progress = 0;
        if (profile.full_name) progress += 50;
        if (profile.avatar_url) progress += 50;
        setProfileProgress(progress);
      }
    };

    fetchProfile();
  }, [user.id]);

  const updateProfile = debounce(async (name: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your changes have been saved automatically.",
      });
      
      setProfileProgress(prev => avatar_url ? 100 : 50);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  }, 1000);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setProfileProgress(prev => fullName ? 100 : 50);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Profile Settings</CardTitle>
            <CardDescription>Manage your account settings and profile information</CardDescription>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge variant={user.email_confirmed_at ? "default" : "outline"} className="h-6 cursor-help">
                {user.email_confirmed_at ? (
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </div>
                ) : "Unverified"}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Email Verification Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {user.email_confirmed_at 
                      ? "Your email has been verified. You have full access to all features."
                      : "Please verify your email to access all features."}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-xs text-muted-foreground">{joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-xs text-muted-foreground">Standard User</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Profile Completion</p>
                    <Progress value={profileProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Avatar Section */}
          <div className="flex items-start space-x-8">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                <AvatarImage src={avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10">
                  <UserIcon className="h-12 w-12 text-primary" />
                </AvatarFallback>
              </Avatar>
              <label 
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                htmlFor="avatar"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    updateProfile(e.target.value);
                  }}
                  placeholder="Enter your full name"
                  className="max-w-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email Address
                </label>
                <div className="flex items-center space-x-2 max-w-md">
                  <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Primary
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};