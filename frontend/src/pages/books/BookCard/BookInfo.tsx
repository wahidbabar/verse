import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface BookInfoProps {
  id: string;
  title: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  category?: string;
  author?: string;
}

export const BookInfo = ({
  id,
  title,
  description,
  newPrice,
  oldPrice,
  category,
  author,
}: BookInfoProps) => {
  const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  return (
    <div className="space-y-3">
      {category && (
        <Badge variant="secondary" className="mb-2 text-white">
          {category}
        </Badge>
      )}

      <Link to={`/books/${id}`} className="block group">
        <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
      </Link>

      {author && <p className="text-sm text-muted-foreground">by {author}</p>}

      <p className="text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold">${newPrice.toFixed(2)}</span>
        {oldPrice > newPrice && (
          <>
            <span className="text-sm text-muted-foreground line-through">
              ${oldPrice.toFixed(2)}
            </span>
            <Badge variant="destructive" className="ml-auto">
              {discount}% OFF
            </Badge>
          </>
        )}
      </div>
    </div>
  );
};
