
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReportFilterProps {
  tab: string;
  setTab: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

const ReportFilter = ({ tab, setTab, search, setSearch }: ReportFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Current Reports</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="mine">My Reports</TabsTrigger>
          <TabsTrigger value="volunteered">Volunteered</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ReportFilter;
