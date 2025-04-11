
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem("onboardingComplete") === "true";
    
    // Redirect based on authentication and onboarding status
    if (user) {
      navigate("/dashboard");
    } else if (onboardingComplete) {
      navigate("/auth");
    } else {
      navigate("/onboarding");
    }
  }, [navigate, user, loading]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary">Stray Saver</h1>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-400"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        </div>
        <p className="text-muted-foreground mt-4">Loading application...</p>
      </div>
    </div>
  );
};

export default Index;
