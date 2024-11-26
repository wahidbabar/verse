// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import { FiAlertTriangle, FiLoader } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BookCard from "../books/BookCard";
import { useFetchBooks } from "@/api/books";

const Recommend = () => {
  const { data: books, isLoading } = useFetchBooks();

  if (isLoading) {
    <div className="h-full flex items-center justify-center">
      <FiLoader className="size-5 animate-spin text-muted-foreground" />
    </div>;
  }

  if (!books) {
    <div className="h-screen flex flex-1 items-center justify-center flex-col gap-2">
      <FiAlertTriangle className="size-8 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No books found</span>
    </div>;
  }

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold mb-6">Recommended for you </h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {books?.length! > 0 &&
          books?.slice(8, 18).map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Recommend;
