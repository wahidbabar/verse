import { IBook } from "@/api/types";
import { Sparkles } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BookCard from "../books/BookCard";

const Recommend = ({ books }: { books: IBook[] }) => {
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
