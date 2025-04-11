
import { useState, useEffect } from "react";
import { User, Settings, Bell, LogOut, Edit, Award, MapPin, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    all: true,
    nearby: true,
    critical: true,
    updates: false,
  });
  const [reportStats, setReportStats] = useState({
    submitted: 0,
    volunteered: 0
  });
  
  useEffect(() => {
    if (user) {
      // Fetch reports statistics
      const fetchReportStats = async () => {
        // Count submitted reports
        const { data: submittedData, error: submittedError } = await supabase
          .from("reports")
          .select("id", { count: 'exact' })
          .eq("reporter_id", user.id);
        
        if (submittedError) {
          console.error("Error fetching submitted reports:", submittedError);
        } else {
          setReportStats(prev => ({ ...prev, submitted: submittedData.length }));
        }
        
        // Count volunteered reports
        const { data: volunteeredData, error: volunteeredError } = await supabase
          .from("reports")
          .select("id", { count: 'exact' })
          .eq("volunteer_id", user.id);
        
        if (volunteeredError) {
          console.error("Error fetching volunteered reports:", volunteeredError);
        } else {
          setReportStats(prev => ({ ...prev, volunteered: volunteeredData.length }));
        }
      };
      
      fetchReportStats();
    }
  }, [user]);
  
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };
  
  const handleLogOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <Card className="text-center py-8">
          <CardContent className="flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Not Logged In</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
            <Button onClick={() => window.location.href = "/auth"}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="pb-20">
        <Card className="mb-6 overflow-hidden shadow-md">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/80" />
          <CardHeader className="pt-0">
            <div className="flex justify-between">
              <Avatar className="h-20 w-20 border-4 border-background -mt-10 shadow-md">
                <AvatarImage src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || user?.email || 'User'}&background=14b8a6&color=fff`} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name ? profile.full_name.charAt(0) : user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <CardTitle>{profile?.full_name || user.email?.split('@')[0] || 'User'}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Member since {new Date(user.created_at || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              {profile?.is_volunteer && (
                <Badge variant="outline" className="bg-primary/10">
                  <Award className="h-3 w-3 mr-1" />
                  Volunteer
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/10">
                <Heart className="h-3 w-3 mr-1" />
                {reportStats.submitted} Reports Submitted
              </Badge>
              {reportStats.volunteered > 0 && (
                <Badge variant="outline" className="bg-primary/10">
                  <Award className="h-3 w-3 mr-1" />
                  {reportStats.volunteered} Rescues
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Animal lover dedicated to helping strays find safety and care.
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-all" className="flex-1">
                  All Notifications
                </Label>
                <Switch 
                  id="notify-all" 
                  checked={notifications.all} 
                  onCheckedChange={() => toggleNotification("all")} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-nearby" className="flex-1">
                  Nearby Reports (within 5 miles)
                </Label>
                <Switch 
                  id="notify-nearby" 
                  checked={notifications.nearby} 
                  onCheckedChange={() => toggleNotification("nearby")} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-critical" className="flex-1">
                  Critical Cases Only
                </Label>
                <Switch 
                  id="notify-critical" 
                  checked={notifications.critical} 
                  onCheckedChange={() => toggleNotification("critical")} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-updates" className="flex-1">
                  App Updates & News
                </Label>
                <Switch 
                  id="notify-updates" 
                  checked={notifications.updates} 
                  onCheckedChange={() => toggleNotification("updates")} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Email</span>
                <span>{user.email}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Name</span>
                <span>{profile?.full_name || 'Not provided'}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Member Since</span>
                <span>{new Date(user.created_at || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
