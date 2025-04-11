
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sponsor, isSponsor } from "@/types/sponsors";
import { toast } from "sonner";

const SponsorsBanner = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setIsLoading(true);
        // Use any to bypass type checking for the sponsors table
        const { data, error } = await (supabase
          .from('sponsors' as any)
          .select('*')
          .eq('status', 'approved') as any);

        if (error) {
          // Check if error is because table doesn't exist
          if (error.code === "42P01") {
            console.log("Sponsors table does not exist yet");
            setHasError(true);
          } else {
            throw error;
          }
        } else {
          // Filter to ensure we only have valid sponsor objects
          const validSponsors = Array.isArray(data) 
            ? data.filter(isSponsor)
            : [];
          setSponsors(validSponsors as Sponsor[]);
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();

    // Auto-rotate sponsors every 7 seconds
    const interval = setInterval(() => {
      if (sponsors.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % sponsors.length);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [sponsors.length]);

  if (isLoading) {
    return null;
  }

  if (hasError || sponsors.length === 0) {
    return null;
  }

  const currentSponsor = sponsors[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sponsors.length);
  };

  return (
    <Card className="mb-6 overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 mr-4 flex items-center justify-center h-16 w-16">
              <img
                src={currentSponsor.logo_url}
                alt={`${currentSponsor.company_name} logo`}
                className="max-h-12 max-w-12 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">{currentSponsor.company_name}</h3>
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {currentSponsor.sponsorship_level.charAt(0).toUpperCase() + 
                   currentSponsor.sponsorship_level.slice(1)} Sponsor
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {currentSponsor.description || "Proudly supporting animal rescue efforts"}
              </p>
            </div>
          </div>
          
          <div className="ml-4 flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handlePrev}
              disabled={sponsors.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full ml-1"
              onClick={handleNext}
              disabled={sponsors.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Heart className="h-3 w-3 text-primary" />
            <span>Sponsors help us save more animals</span>
          </div>
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs p-0 h-auto" 
            onClick={() => window.location.href = "/sponsor"}
          >
            Become a sponsor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorsBanner;
