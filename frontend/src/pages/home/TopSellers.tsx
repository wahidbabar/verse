import { useEffect, useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useFetchBooks } from "@/api/books";
import { IBook } from "@/api/types";
import Loading from "@/components/Loading";
import { mockBooks } from "@/utils/mockData";
import { FiAlertTriangle } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const categories = [
  "Choose a genre",
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
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const [books, setBooks] = useState<IBook[] | undefined>(mockBooks);
  const { data, isLoading } = useFetchBooks();

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (!books) {
    <div className="h-screen flex flex-1 items-center justify-center flex-col gap-2">
      <FiAlertTriangle className="size-8 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No books found</span>
    </div>;
  }

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books?.filter((book) => book.category === selectedCategory);

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>
      {/* category filtering */}
      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          id="category"
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

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
        {filteredBooks?.length! > 0 &&
          filteredBooks?.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default TopSellers;
