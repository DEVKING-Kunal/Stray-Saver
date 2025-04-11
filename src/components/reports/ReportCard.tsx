
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { MapPin, ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import ReportActions from "./ReportActions";

type Report = Tables<"reports">;

interface ReportCardProps {
  report: Report;
  seenReportIds: Set<string>;
  currentUser: any;
  onMarkAsSeen: (reportId: string) => Promise<void>;
  onMarkAsRescued: (reportId: string) => Promise<void>;
  onViewDetails: (reportId: string) => void;
  onSponsorRescue: () => void;
}

const ReportCard = ({
  report,
  seenReportIds,
  currentUser,
  onMarkAsSeen,
  onMarkAsRescued,
  onViewDetails,
  onSponsorRescue,
}: ReportCardProps) => {
  const isReportSeen = seenReportIds.has(report.id);
  const isResolved = report.status === 'resolved';
  const isReporterCurrentUser = report.reporter_id === currentUser?.id;
  const isVolunteerCurrentUser = report.volunteer_id === currentUser?.id;

  const getStatusBadge = (status: string, reportId: string) => {
    // If the report has been marked as seen locally but the status is still "waiting"
    if (seenReportIds.has(reportId) && status === "waiting") {
      return <Badge variant="outline" className="bg-purple-500 bg-opacity-20 text-purple-700 dark:text-purple-400">Seen</Badge>;
    }

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

  const formatSpecies = (species: string): string => {
    return species.charAt(0).toUpperCase() + species.slice(1);
  };

  const getSponsorName = (reportId: string) => {
    const sponsorsByLevel = {
      'basic': ['PetCare Plus', 'Animal Friends'],
      'standard': ['VetMed Services', 'PawsForward'],
      'premium': ['PetLuxe Brands', 'AnimalRescue Inc']
    };
    
    const sponsorLevel = ['basic', 'standard', 'premium'][parseInt(reportId.charAt(0), 36) % 3];
    const sponsors = sponsorsByLevel[sponsorLevel as keyof typeof sponsorsByLevel];
    return sponsors[parseInt(reportId.charAt(1), 36) % sponsors.length];
  };

  const openLocationInMaps = (lat: number, lng: number) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };
  const getRescuePoweredBy = () => {
    if (!isResolved) {
      return <span className="text-muted-foreground">—</span>;
    }
  
    if (isVolunteerCurrentUser) {
      return (
        <Badge
          variant="outline"
          className="bg-green-500 bg-opacity-20 text-green-800 dark:text-green-300"
        >
          Self
        </Badge>
      );
    }
  
    return (
      <Badge
        variant="outline"
        className="bg-primary bg-opacity-10 text-primary-800 dark:text-primary-300"
      >
        {getSponsorName(report.id)}
      </Badge>
    );
  };
  return (
    <TableRow>
      <TableCell className="font-medium capitalize">{formatSpecies(report.species)}</TableCell>
      <TableCell>{getSeverityBadge(report.severity)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <button 
            onClick={() => openLocationInMaps(report.latitude, report.longitude)} 
            className="text-sm text-primary underline flex items-center"
          >
            {report.landmark || `${report.latitude.toFixed(2)}, ${report.longitude.toFixed(2)}`}
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {new Date(report.created_at).toLocaleDateString()}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {getRescuePoweredBy()}
      </TableCell>
      <TableCell>{getStatusBadge(report.status || 'waiting', report.id)}</TableCell>
      <TableCell className="text-right">
        <ReportActions 
          reportId={report.id}
          isResolved={isResolved}
          isReportSeen={isReportSeen}
          onViewDetails={() => onViewDetails(report.id)}
          onMarkAsSeen={() => onMarkAsSeen(report.id)}
          onMarkAsRescued={() => onMarkAsRescued(report.id)}
          onSponsorRescue={onSponsorRescue}
        />
      </TableCell>
    </TableRow>
  );
};

export default ReportCard;
