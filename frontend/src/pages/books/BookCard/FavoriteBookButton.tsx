import { useToggleFavoriteBook } from "@/api/books";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart } from "lucide-react";
import React, { useState } from "react";

interface FavoriteBookButtonProps {
  userId: string;
  bookId: string;
  favoritedBy: string[];
}

const FavoriteBookButton: React.FC<FavoriteBookButtonProps> = ({
  userId,
  bookId,
  favoritedBy,
}) => {
  const [isFavorite, setIsFavorite] = useState(
    favoritedBy?.includes(userId) ?? false
  );
  const toggleFavoriteBook = useToggleFavoriteBook(userId);

  const handleToggleFavorite = (): void => {
    setIsFavorite(!isFavorite);

    toggleFavoriteBook.mutate(bookId, {
      onError: () => {
        setIsFavorite((prev) => !prev);
      },
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isFavorite ? "destructive" : "outline"}
            size="icon"
            className="w-8 h-8"
            onClick={handleToggleFavorite}
          >
            <Heart
              className="w-4 h-4"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FavoriteBookButton;
