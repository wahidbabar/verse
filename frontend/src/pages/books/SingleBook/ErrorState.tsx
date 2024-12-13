import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ErrorState = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was a problem loading the book information. Please try again
          later.
        </AlertDescription>
      </Alert>
    </div>
  );
};
