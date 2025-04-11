
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReportTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Species</TableHead>
        <TableHead>Severity</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Rescue Powered By</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ReportTableHeader;
