import { IBook } from "@/api/types";
import useCartStore from "@/store/cart-store";
import { Card, CardContent } from "@/components/ui/card";
import { BookImage } from "./BookImage";
import { BookInfo } from "./BookInfo";
import { BookActions } from "./BookAction";
import { useToggleFavoriteBook } from "@/api/books";
import { useState } from "react";

interface BookCardProps {
  book: IBook;
  layout?: "grid" | "list";
}

const BookCard = ({ book, layout = "grid" }: BookCardProps) => {
  const { addToCart, userId } = useCartStore();
  const [isFavorite, setIsFavorite] = useState(
    book.favoritedBy?.includes(userId!)
  );
  const toggleFavoriteBook = useToggleFavoriteBook(userId!);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);

    toggleFavoriteBook.mutate(book._id, {
      onError: () => {
        setIsFavorite((prev) => !prev);
      },
    });
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent
        className={`p-4 ${
          layout === "list" ? "flex gap-6" : "flex flex-col gap-4"
        }`}
      >
        <div className={layout === "list" ? "w-48 flex-shrink-0" : "w-full"}>
          <BookImage
            id={book._id}
            coverUrl={book.coverImage.url}
            title={book.title}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <BookInfo
            id={book._id}
            title={book.title}
            description={book.description}
            newPrice={book.newPrice}
            oldPrice={book.oldPrice}
            category={book.category}
            author={book.author}
          />

          <BookActions
            book={book}
            userId={userId}
            onAddToCart={addToCart}
            onToggleFavorite={handleToggleFavorite}
            isFavorited={isFavorite}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
