
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import ReportCard from "./ReportCard";
import EmptyReportState from "./EmptyReportState";
import LoadingState from "./LoadingState";
import ReportTableHeader from "./ReportTableHeader";
import { getAvailableRewards } from "@/services/rewardsService";

type Report = Tables<"reports">;
type UIReportStatus = "waiting" | "in-progress" | "resolved" | "seen";

type ReportsListProps = {
  reports: Report[];
  loading: boolean;
  seenReportIds: Set<string>;
  currentUser: any;
  onReportStatusUpdate: (reportId: string, status: UIReportStatus) => Promise<void>;
};

const ReportsList = ({ 
  reports, 
  loading, 
  seenReportIds,
  currentUser,
  onReportStatusUpdate
}: ReportsListProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleSponsorRescue = () => {
    if (!currentUser) {
      toast.error("You must be logged in to sponsor a rescue");
      navigate("/auth");
      return;
    }
    
    navigate('/sponsor');
    toast.info("Sponsorship options loaded");
  };
  
  const handleMarkAsSeen = async (reportId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to update status");
      navigate("/auth");
      return;
    }
    
    try {
      await onReportStatusUpdate(reportId, "seen");
      // No need to refresh reports here as the parent will handle it
    } catch (error: any) {
      console.error("Error marking as seen:", error);
      toast.error(error.message || "Failed to mark as seen");
    }
  };
  
  const handleMarkAsRescued = async (reportId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to update status");
      navigate("/auth");
      return;
    }
    
    try {
      await onReportStatusUpdate(reportId, "resolved");
      toast.success("Report marked as rescued");
    } catch (error: any) {
      console.error("Error marking as rescued:", error);
      toast.error(error.message || "Failed to mark as rescued");
    }
  };

  // Filter reports that aren't resolved to show in the main list
  const activeReports = reports;

  if (loading) {
    return <LoadingState />;
  }

  if (reports.length === 0) {
    return <EmptyReportState />;
  }

  return (
    <div className="space-y-4">
      <Table>
        <ReportTableHeader />
        <TableBody>
          {activeReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              seenReportIds={seenReportIds}
              currentUser={currentUser}
              onMarkAsSeen={handleMarkAsSeen}
              onMarkAsRescued={handleMarkAsRescued}
              onViewDetails={handleViewDetails}
              onSponsorRescue={handleSponsorRescue}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsList;
