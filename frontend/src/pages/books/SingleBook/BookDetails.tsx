import { CalendarDays, BookOpen, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookDetailsProps {
  title: string;
  author: string;
  category: string;
  createdAt: string | Date;
  description: string;
}

export const BookDetails = ({
  title,
  author,
  category,
  createdAt,
  description,
}: BookDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary" className="mb-4 text-white">
          {category || "Uncategorized"}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex flex-wrap gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>{author || "Unknown Author"}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span className="capitalize">{category || "Uncategorized"}</span>
        </div>
      </div>

      <Separator />

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">About this book</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};
