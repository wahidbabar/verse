import { IBook } from "@/api/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import FavoriteBookButton from "./FavoriteBookButton";

interface BookActionsProps {
  book: IBook;
  userId: string | null;
  onAddToCart: (book: IBook) => void;
}

export const BookActions = ({
  userId,
  book,
  onAddToCart,
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

      {userId && Array.isArray(book.favoritedBy) && (
        <FavoriteBookButton
          userId={userId}
          bookId={book._id}
          favoritedBy={book.favoritedBy}
        />
      )}
    </div>
  );
};
