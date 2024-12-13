import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface BookImageProps {
  imageUrl: string;
  title: string;
}

export const BookImage = ({ imageUrl, title }: BookImageProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-muted">
      <AspectRatio ratio={3 / 4} className="relative group">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </AspectRatio>
    </Card>
  );
};
