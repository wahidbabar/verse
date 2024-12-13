import { useFetchBooks } from "@/api/books";
import { IBook } from "@/api/types";
import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockBooks } from "@/utils/mockData";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BookCard from "../books/BookCard";

const categories = [
  "All Genres",
  "Business",
  "Fiction",
  "Horror",
  "Adventure",
  "History",
  "Thriller",
  "Humor",
  "Cooking",
  "Literature",
  "Science",
  "Mystery",
  "Self-Help",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Genres");
  const [books, setBooks] = useState<IBook[] | undefined>(mockBooks);
  const { data, isLoading } = useFetchBooks();

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  if (!books && isLoading) return <Loading />;

  if (!books) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/10 rounded-lg">
        <div className="text-center space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No books available</p>
        </div>
      </div>
    );
  }

  const filteredBooks =
    selectedCategory === "All Genres"
      ? books
      : books?.filter((book) => book.category === selectedCategory);

  return (
    <div className="py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Top Sellers</h2>
          <p className="text-muted-foreground">
            Discover our most popular books
          </p>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Navigation, Pagination]}
          className="!pb-12"
        >
          {filteredBooks?.length ? (
            filteredBooks.map((book, index) => (
              <SwiperSlide key={index}>
                <BookCard book={book} />
              </SwiperSlide>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No books found in {selectedCategory}
              </p>
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default TopSellers;
