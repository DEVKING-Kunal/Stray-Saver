
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
      <div className="text-primary">Loading reports...</div>
    </div>
  );
};

export default LoadingState;
