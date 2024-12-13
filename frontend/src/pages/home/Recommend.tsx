import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { BookOpen, Sparkles } from "lucide-react";
import { useFetchBooks } from "@/api/books";
import { useEffect, useState } from "react";
import { IBook } from "@/api/types";
import { mockBooks } from "@/utils/mockData";
import Loading from "@/components/Loading";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BookCard from "../books/BookCard";

const Recommend = () => {
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
          <p className="text-muted-foreground">No recommendations available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">Recommended for You</h2>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Personalized picks based on your interests
          </p>
        </div>
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
          {books.slice(8, 18).map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Recommend;
