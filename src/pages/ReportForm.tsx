import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Upload, MapPin, Mic, AlertTriangle, Clock, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { Tables, Json } from "@/integrations/supabase/types";
import { getInjuryAssessment, InjuryAssessment } from "@/services/geminiService";
import { formatReportForEmail } from "@/utils/reportFormatter";
import { ngoEmails } from "@/config/ngoEmails";

type Report = Tables<"reports">;

const ReportForm = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [additionalPhotoFiles, setAdditionalPhotoFiles] = useState<File[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioClip, setAudioClip] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());
  const [species, setSpecies] = useState<string>("");
  const [count, setCount] = useState<string>("1");
  const [severity, setSeverity] = useState<string>("normal");
  const [isBlockingTraffic, setIsBlockingTraffic] = useState<boolean>(false);
  const [trafficDensity, setTrafficDensity] = useState<number>(50);
  const [landmark, setLandmark] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("normal");
  const [isVolunteer, setIsVolunteer] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [injuryAssessment, setInjuryAssessment] = useState<InjuryAssessment | null>(null);
  const [showAssessment, setShowAssessment] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to submit a report");
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    const getAssessment = async () => {
      if (species && severity === "normal") {
        try {
          const assessment = await getInjuryAssessment(species, severity, notes);
          setInjuryAssessment(assessment);
          setShowAssessment(true);
        } catch (error) {
          console.error("Error getting injury assessment:", error);
        }
      } else {
        setShowAssessment(false);
      }
    };

    getAssessment();
  }, [species, severity, notes]);

  const capturePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        setPhotoFile(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            toast.success("Location captured");
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error("Couldn't get location");
          }
        );
        
        setTimestamp(new Date().toISOString());
      }
    };
    
    input.click();
  };

  const addAdditionalPhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        setAdditionalPhotoFiles(prev => [...prev, file]);
        
        const reader = new FileReader();
        reader.onload = () => {
          setAdditionalPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const removePhoto = (index: number) => {
    setAdditionalPhotos(additionalPhotos.filter((_, i) => i !== index));
    setAdditionalPhotoFiles(additionalPhotoFiles.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    if (recording) {
      setAudioClip("audio-clip-example.mp3");
      toast.success("Audio recording saved");
    } else {
      toast.info("Recording started...");
    }
    setRecording(!recording);
  };

  const removeAudioClip = () => {
    setAudioClip(null);
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('report-photos')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const sendReportEmail = async (report: Report, imageUrl: string) => {
    try {
      // Get user name or default to email username or "Anonymous"
      const userName = profile?.full_name || user?.email?.split('@')[0] || 'Anonymous';
      
      // Format the email content
      const emailContent = formatReportForEmail(report, imageUrl, userName);
      
      console.log("Sending email to NGOs:", emailContent);
      
      // Send email via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: { 
          to: emailContent.to,
          subject: emailContent.subject,
          html: emailContent.html
        }
      });
      
      if (error) {
        console.error("Error invoking send-report-email function:", error);
        throw error;
      }
      
      console.log("Email sent successfully:", data);
      toast.success(`Report sent to ${ngoEmails.length} NGO email addresses`);
      
      return true;
    } catch (error) {
      console.error("Error sending report email:", error);
      toast.error("Failed to send email notifications, but report was saved");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a report");
      navigate("/auth");
      return;
    }
    
    if (!photoFile || !location) {
      toast.error("Please capture a photo with location");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload the main photo
      const photoUrl = await uploadPhoto(photoFile);
      
      // Upload additional photos if any
      const additionalPhotoUrls: string[] = [];
      for (const file of additionalPhotoFiles) {
        const url = await uploadPhoto(file);
        additionalPhotoUrls.push(url);
      }
      
      // Create the report in Supabase
      const { data: reportData, error } = await supabase
        .from("reports")
        .insert({
          species: species as any,
          count: count,
          severity: severity as any,
          photo_url: photoUrl,
          additional_photos: additionalPhotoUrls as unknown as Json,
          audio_clip_url: audioClip,
          latitude: location.lat,
          longitude: location.lng,
          timestamp: timestamp,
          is_blocking_traffic: isBlockingTraffic,
          traffic_density: trafficDensity,
          landmark: landmark,
          urgency: urgency as any,
          status: 'waiting',
          notes: notes,
          reporter_id: user.id
        })
        .select("*")
        .single();
      
      if (error) throw error;
      
      // Send email notification if report was created successfully
      if (reportData) {
        await sendReportEmail(reportData, photoUrl);
      }
      
      toast.success("Report submitted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto pb-20">
        <h1 className="text-2xl font-bold mb-6">Report Stray Animal</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {photo ? (
                <div className="relative">
                  <img 
                    src={photo} 
                    alt="Captured" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs p-2 rounded-md">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(timestamp).toLocaleString()}</span>
                    </div>
                    {location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center h-64 bg-muted cursor-pointer"
                  onClick={capturePhoto}
                >
                  <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Tap to capture photo</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select value={species} onValueChange={setSpecies}>
                <SelectTrigger id="species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="count">Number of Animals</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Severity Level</Label>
              <RadioGroup value={severity} onValueChange={setSeverity} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical" className="text-destructive font-semibold">Critical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serious" id="serious" />
                  <Label htmlFor="serious" className="text-amber-500 dark:text-amber-400 font-semibold">Serious</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal">Normal</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {showAssessment && injuryAssessment && (
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Care Recommendations</AlertTitle>
              <AlertDescription>
                <p className="mb-2">{injuryAssessment.recommendation}</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {injuryAssessment.careSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="traffic-toggle">Blocking Traffic?</Label>
              <Switch 
                id="traffic-toggle" 
                checked={isBlockingTraffic} 
                onCheckedChange={setIsBlockingTraffic} 
              />
            </div>
            
            {isBlockingTraffic && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="traffic-density">Traffic Density</Label>
                    <span className="text-sm text-muted-foreground">
                      {trafficDensity < 33 ? "Light" : trafficDensity < 66 ? "Moderate" : "Heavy"}
                    </span>
                  </div>
                  <Slider
                    id="traffic-density"
                    min={0}
                    max={100}
                    step={1}
                    value={[trafficDensity]}
                    onValueChange={(value) => setTrafficDensity(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="e.g., Near gas station, school, etc."
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Additional Media</h3>
            
            <div className="space-y-2">
              <Label>Additional Photos/Videos</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {additionalPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Additional ${index}`} 
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {additionalPhotos.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={addAdditionalPhoto}
                  >
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">Add</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Audio Note</Label>
              {audioClip ? (
                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center">
                    <Mic className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">Audio clip recorded</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAudioClip}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant={recording ? "destructive" : "outline"}
                  className="w-full"
                  onClick={toggleRecording}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {recording ? "Stop Recording" : "Record Audio Note"}
                </Button>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Urgency</Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="urgency-critical" />
                  <Label htmlFor="urgency-critical" className="text-destructive font-semibold flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Critical (Immediate attention needed)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="urgency-high" />
                  <Label htmlFor="urgency-high" className="text-amber-500 dark:text-amber-400 font-semibold">
                    High (Needs attention soon)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="urgency-normal" />
                  <Label htmlFor="urgency-normal">
                    Normal (Standard priority)
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="volunteer-toggle" className="block">Volunteer to Help</Label>
                <p className="text-sm text-muted-foreground">I can assist with this animal</p>
              </div>
              <Switch 
                id="volunteer-toggle" 
                checked={isVolunteer} 
                onCheckedChange={setIsVolunteer} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional details about the situation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">NGO Notification</CardTitle>
              <CardDescription>
                This report will be emailed to {ngoEmails.length} animal welfare NGOs when submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-muted-foreground">
              <p>Email recipients: {ngoEmails.join(", ")}</p>
            </CardContent>
          </Card>
          
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !photo || !species}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default ReportForm;
