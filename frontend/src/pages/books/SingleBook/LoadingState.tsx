import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading book details...</p>
      </div>
    </div>
  );
};
