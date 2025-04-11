import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

const MapView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    critical: true,
    serious: true,
    normal: true,
    resolved: false,
  });
  const [activePin, setActivePin] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        let query = supabase.from("reports").select("*");
        
        // Apply filters
        if (filter === "mine" && user) {
          query = query.eq("reporter_id", user.id);
        }
        
        if (!filters.resolved) {
          query = query.neq("status", "resolved");
        }
        
        const severityFilters = [];
        if (filters.critical) severityFilters.push("critical");
        if (filters.serious) severityFilters.push("serious");
        if (filters.normal) severityFilters.push("normal");
        
        if (severityFilters.length > 0 && severityFilters.length < 3) {
          query = query.in("severity", severityFilters);
        }
        
        // Sort by created date descending
        query = query.order("created_at", { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
    
    // Set up a realtime subscription for new reports
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, filters, user]);
  
  const updateFilter = (value: string) => {
    setFilter(value);
    toast.info(`Showing ${value} reports`);
  };
  
  const toggleFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };
  
  const handlePinClick = (id: string) => {
    setActivePin(id === activePin ? null : id);
  };
  
  const reportStatuses = {
    "waiting": "bg-amber-500",
    "in-progress": "bg-blue-500",
    "resolved": "bg-green-500",
  };
  
  const severityColors = {
    "critical": "bg-red-500",
    "serious": "bg-amber-500",
    "normal": "bg-blue-500",
  };
  
  return (
    <MainLayout>
      <div className="h-[calc(100vh-11rem)] relative">
        {/* Filter controls */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-2 glass rounded-lg mb-2">
          <ToggleGroup 
            type="single" 
            value={filter}
            onValueChange={(value) => value && updateFilter(value)}
          >
            <ToggleGroupItem value="all" aria-label="Show all reports">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="nearby" aria-label="Show nearby reports">
              Nearby
            </ToggleGroupItem>
            <ToggleGroupItem value="mine" aria-label="Show my reports">
              Mine
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <h3 className="text-sm font-medium mb-2">Severity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <Label htmlFor="filter-critical">Critical</Label>
                    </div>
                    <Switch 
                      id="filter-critical" 
                      checked={filters.critical} 
                      onCheckedChange={() => toggleFilter("critical")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <Label htmlFor="filter-serious">Serious</Label>
                    </div>
                    <Switch 
                      id="filter-serious" 
                      checked={filters.serious} 
                      onCheckedChange={() => toggleFilter("serious")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <Label htmlFor="filter-normal">Normal</Label>
                    </div>
                    <Switch 
                      id="filter-normal" 
                      checked={filters.normal} 
                      onCheckedChange={() => toggleFilter("normal")} 
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <Label htmlFor="filter-resolved">Show Resolved</Label>
                    </div>
                    <Switch 
                      id="filter-resolved" 
                      checked={filters.resolved} 
                      onCheckedChange={() => toggleFilter("resolved")} 
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Map Mockup */}
        <div className="h-full w-full bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden">
          {/* This would be replaced with actual map component */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Map View</p>
              <p className="text-sm">(Map would render here in production)</p>
            </div>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="animate-pulse text-primary">Loading reports...</div>
            </div>
          )}
          
          {/* Sample map pins */}
          {reports.map((report) => (
            <Button
              key={report.id}
              variant="outline"
              size="icon"
              className={`absolute rounded-full border-2 ${
                severityColors[report.severity as keyof typeof severityColors] || "bg-gray-500"
              } ${
                activePin === report.id ? "w-8 h-8 z-20" : "w-6 h-6"
              } transition-all duration-200`}
              style={{
                left: `${30 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 60}%`,
                transform: "translate(-50%, -50%)"
              }}
              onClick={() => handlePinClick(report.id)}
            >
              <MapPin className="h-3 w-3 text-white" />
            </Button>
          ))}
          
          {/* Active pin info */}
          {activePin !== null && (
            <div 
              className="absolute left-1/2 bottom-4 transform -translate-x-1/2 w-5/6 max-w-md glass p-4 rounded-lg animate-fade-in"
            >
              {reports.filter(report => report.id === activePin).map(report => (
                <div key={report.id} className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={severityColors[report.severity as keyof typeof severityColors] || "bg-gray-500"}>
                        {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {report.species.charAt(0).toUpperCase() + report.species.slice(1)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          reportStatuses[report.status as keyof typeof reportStatuses] || "bg-gray-500"
                        } bg-opacity-20`}
                      >
                        {report.status ? (report.status.charAt(0).toUpperCase() + report.status.slice(1)) : "Unknown"}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">
                      Reported: {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/report/${report.id}`)}
                  >
                    Details
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add new report button */}
          <Button
            className="absolute bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
            onClick={() => navigate("/report")}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default MapView;
