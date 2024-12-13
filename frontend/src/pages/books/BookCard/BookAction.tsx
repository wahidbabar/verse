import { IBook } from "@/api/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookActionsProps {
  book: IBook;
  userId: string | null;
  onAddToCart: (book: IBook) => void;
  onToggleFavorite?: () => void;
  isFavorited?: boolean;
}

export const BookActions = ({
  book,
  onAddToCart,
  onToggleFavorite,
  isFavorited,
}: BookActionsProps) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Button
        onClick={() => onAddToCart(book)}
        className="flex-1 gap-2"
        size="sm"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </Button>

      {onToggleFavorite && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isFavorited ? "destructive" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={onToggleFavorite}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorited ? "currentColor" : "none"}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
