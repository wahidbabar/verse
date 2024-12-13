import { IBook } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface BookActionsProps {
  book: IBook;
  onAddToCart: (book: IBook) => void;
}

export const BookActions = ({ book, onAddToCart }: BookActionsProps) => {
  const discount = Math.round(
    ((book.oldPrice - book.newPrice) / book.oldPrice) * 100
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-3xl font-bold">
            ${book.newPrice.toFixed(2)}
          </span>
          {book.oldPrice > book.newPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ${book.oldPrice.toFixed(2)}
              </span>
              <Badge variant="destructive" className="text-sm">
                {discount}% OFF
              </Badge>
            </>
          )}
        </div>

        <Button
          onClick={() => onAddToCart(book)}
          size="lg"
          className="w-full gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
