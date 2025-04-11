
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [permissionsGranted, setPermissionsGranted] = useState({
    camera: false,
    location: false,
  });

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the camera stream immediately after permission is granted
      stream.getTracks().forEach((track) => track.stop());
      setPermissionsGranted((prev) => ({ ...prev, camera: true }));
      toast.success("Camera permission granted");
      setStep(1);
    } catch (error) {
      toast.error("Camera permission denied");
      console.error("Error requesting camera permission:", error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setPermissionsGranted((prev) => ({ ...prev, location: true }));
      toast.success("Location permission granted");
      setStep(2);
    } catch (error) {
      toast.error("Location permission denied");
      console.error("Error requesting location permission:", error);
    }
  };

  const finishOnboarding = () => {
    // Store in localStorage that onboarding is complete
    localStorage.setItem("onboardingComplete", "true");
    navigate("/map");
  };

  const steps = [
    {
      title: "Camera Access",
      description:
        "Stray Saver needs access to your camera to take photos of animals in need.",
      icon: <Camera className="h-16 w-16 text-primary" />,
      action: requestCameraPermission,
      actionText: "Grant Camera Access",
    },
    {
      title: "Location Access",
      description:
        "We need your location to accurately pinpoint where the animal was found.",
      icon: <MapPin className="h-16 w-16 text-primary" />,
      action: requestLocationPermission,
      actionText: "Grant Location Access",
    },
    {
      title: "All Set!",
      description:
        "Thank you for helping animals in need. You're now ready to start using Stray Saver.",
      icon: <AlertTriangle className="h-16 w-16 text-primary" />,
      action: finishOnboarding,
      actionText: "Start Using Stray Saver",
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Welcome to Stray Saver
        </h1>

        <Card className="w-full animate-fade-in">
          <CardHeader className="flex items-center text-center pb-2">
            <div className="rounded-full p-6 bg-accent mb-4">
              {currentStep.icon}
            </div>
            <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>{currentStep.description}</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button
              size="lg"
              className="w-full"
              onClick={currentStep.action}
            >
              {currentStep.actionText}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-center mt-8 gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "bg-primary w-8"
                  : i < step
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step < 2 && (
          <Button
            variant="link"
            className="mt-4 mx-auto block"
            onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
          >
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
