import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BookImageProps {
  id: string;
  coverUrl: string;
  title: string;
}

export const BookImage = ({ id, coverUrl, title }: BookImageProps) => {
  return (
    <div className="relative group">
      <AspectRatio ratio={2 / 3} className="bg-muted">
        <Link to={`/books/${id}`}>
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        </Link>
      </AspectRatio>
    </div>
  );
};
