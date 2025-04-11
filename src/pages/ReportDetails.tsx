
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Clock, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

const ReportDetails = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!reportId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("id", reportId)
          .single();

        if (error) throw error;
        setReport(data);
      } catch (error: any) {
        console.error("Error fetching report details:", error);
        toast.error(error.message || "Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [reportId]);

  const updateStatus = async (newStatus: "waiting" | "in-progress" | "resolved") => {
    if (!user || !report) {
      toast.error("You must be logged in to update status");
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("reports")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          volunteer_id: user.id
        })
        .eq("id", report.id)
        .select(); // Add select to get the updated record

      if (error) throw error;
      
      // Update the local state with the updated report
      if (data && data.length > 0) {
        setReport(data[0]);
      } else {
        // Fallback to optimistic update if no data returned
        setReport(prev => prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString(), volunteer_id: user.id } : null);
      }
      
      toast.success(`Report marked as ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "serious":
        return <Badge className="bg-amber-500">Serious</Badge>;
      case "normal":
        return <Badge className="bg-blue-500">Normal</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-amber-500 bg-opacity-20 text-amber-700 dark:text-amber-400">Waiting</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-500 bg-opacity-20 text-blue-700 dark:text-blue-400">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-500 bg-opacity-20 text-green-700 dark:text-green-400">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-10">
          <div className="animate-pulse">Loading report details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!report) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Report not found</p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-4">
          &larr; Back to Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="capitalize text-2xl">
                  {report.species} {getSeverityBadge(report.severity)}
                </CardTitle>
                <CardDescription>
                  Report ID: {report.id}
                </CardDescription>
              </div>
              <div>{getStatusBadge(report.status || 'waiting')}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img 
                src={report.photo_url} 
                alt={`${report.species} report`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                  <div className="mt-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Species:</span>
                      <span className="capitalize">{report.species}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Count:</span>
                      <span>{report.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Severity:</span>
                      <span className="capitalize">{report.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Urgency:</span>
                      <span className="capitalize">{report.urgency || 'normal'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <div className="mt-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Landmark:</span>
                      <span>{report.landmark || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <MapPin className="h-3 w-3" />
                      <a 
                        href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      </a>
                    </div>
                    {report.is_blocking_traffic && (
                      <div className="flex justify-between">
                        <span className="font-medium">Traffic Density:</span>
                        <span>{report.traffic_density ? `${report.traffic_density}%` : 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Report Information</h3>
                  <div className="mt-1 space-y-2">
                    <div className="flex flex-col">
                      <span className="font-medium">Notes:</span>
                      <p className="text-sm mt-1">{report.notes || 'No additional notes'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Reported on {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {report.updated_at && report.updated_at !== report.created_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Last updated on {new Date(report.updated_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {report.additional_photos && Array.isArray(report.additional_photos) && report.additional_photos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Photos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {report.additional_photos.map((photo: string, index: number) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`Additional photo ${index + 1}`} 
                          className="h-20 w-full object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {report.status !== 'resolved' && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => updateStatus('in-progress')}>
                  Mark as In Progress
                </Button>
                <Button onClick={() => updateStatus('resolved')}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Rescued
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReportDetails;
