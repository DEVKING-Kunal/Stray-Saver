
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const EmptyReportState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No reports found</p>
      </CardContent>
    </Card>
  );
};

export default EmptyReportState;
