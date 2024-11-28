import { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import useCartStore from "@/store/cart-store";
import { IBook } from "@/api/types";
import { fetchBooks } from "@/api/books";
import SearchResults from "./SearchResults";
import { debounce } from "lodash";

const Navbar = () => {
  const { cartItems } = useCartStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim().length > 2) {
        queryClient.invalidateQueries({ queryKey: ["searchBooks"] });
      }
    }, 300),
    [queryClient]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    queryClient.cancelQueries({ queryKey: ["searchBooks"] });
    debouncedSearch(newSearchTerm);
  };

  const { data: books, isLoading } = useQuery<IBook[]>({
    queryKey: ["searchBooks", searchTerm],
    queryFn: ({ signal }) =>
      fetchBooks({ queryKey: ["searchBooks", searchTerm], signal }),
    enabled: searchTerm.trim().length > 2,
    staleTime: 1000 * 60 * 5,
  });

  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  return (
    <header className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
      <nav className="flex justify-between items-center">
        {/* Logo and Search */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-2xl sm:text-3xl tracking-wider text-primary transition hover:text-primary-dark"
          >
            VERSE
          </Link>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg shadow-sm w-full max-w-sm px-4 py-2">
            <IoSearchOutline className="text-lg text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search here..."
              onChange={handleSearchChange}
              className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Icons Section */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Profile */}
          <Link to="/login" className="text-gray-600 hover:text-primary">
            <HiOutlineUser className="text-2xl" />
          </Link>

          {/* Favorites */}
          <button className="hidden sm:block text-gray-600 hover:text-primary transition">
            <HiOutlineHeart className="text-2xl" />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark transition"
          >
            <HiOutlineShoppingCart className="text-2xl" />
            <span className="ml-1 text-sm font-medium">
              {cartItems.length > 0 ? cartItems.length : 0}
            </span>
          </Link>
        </div>
      </nav>

      {/* Search Results */}
      {searchTerm && (
        <SearchResults books={books || []} isLoading={isLoading} />
      )}
    </header>
  );
};

export default Navbar;
