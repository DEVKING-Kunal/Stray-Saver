
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Award, DollarSign, Check } from "lucide-react";

interface ReportActionsProps {
  reportId: string;
  isResolved: boolean;
  isReportSeen: boolean;
  onViewDetails: () => void;
  onMarkAsSeen: () => void;
  onMarkAsRescued: () => void;
  onSponsorRescue: () => void;
}

const ReportActions = ({
  reportId,
  isResolved,
  isReportSeen,
  onViewDetails,
  onMarkAsSeen,
  onMarkAsRescued,
  onSponsorRescue,
}: ReportActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border shadow-lg">
          <DropdownMenuItem onClick={onViewDetails}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          
          {!isReportSeen && !isResolved && (
            <DropdownMenuItem onClick={onMarkAsSeen}>
              <Check className="mr-2 h-4 w-4" /> Mark as Seen
            </DropdownMenuItem>
          )}
          
          {!isResolved && (
            <DropdownMenuItem onClick={onMarkAsRescued}>
              <Award className="mr-2 h-4 w-4" /> Mark as Rescued
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={onSponsorRescue}>
            <DollarSign className="mr-2 h-4 w-4" /> Sponsor the Rescue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReportActions;
