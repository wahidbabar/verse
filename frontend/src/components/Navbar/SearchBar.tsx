import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchBar = ({
  searchTerm,
  onChange,
  onClear,
}: SearchBarProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-grow max-w-2xl">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={onChange}
          className={cn(
            "pl-10 pr-10 w-full",
            "bg-background border-muted-foreground/20",
            "placeholder:text-muted-foreground/60",
            "focus-visible:ring-primary/20",
            "transition-all duration-200",
            "sm:w-[300px] md:w-[400px] lg:w-full"
          )}
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
