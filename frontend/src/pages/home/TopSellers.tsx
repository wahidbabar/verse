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
import { BiChevronDown } from "react-icons/bi";

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
  // const data = mockBooks;

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  if (!books && isLoading) {
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
      <div className="relative w-full max-w-xs mb-8">
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            name="category"
            id="category"
            className="
            appearance-none 
            w-full 
            bg-white 
            border-2 
            border-blue-300 
            rounded-lg 
            pl-4 
            pr-10 
            py-3 
            text-gray-700 
            font-medium 
            shadow-sm 
            transition-all 
            duration-300 
            hover:border-blue-500 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-300 
            focus:border-transparent 
            cursor-pointer"
          >
            {categories.map((category, index) => (
              <option
                key={index}
                value={category}
                className="bg-white hover:bg-blue-50"
              >
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <BiChevronDown size={20} className="text-blue-500" />
          </div>
        </div>
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
        {filteredBooks?.length! > 0 ? (
          filteredBooks?.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))
        ) : (
          <p>
            Sorry, no books in the category: <strong>{selectedCategory}</strong>
          </p>
        )}
      </Swiper>
    </div>
  );
};

export default TopSellers;
