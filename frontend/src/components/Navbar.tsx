import { fetchBooks } from "@/api/books";
import { IBook } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import useCartStore from "@/store/cart-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineHeart,
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import SearchResults from "./SearchResults";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/user-dashboard",
    icon: <HiOutlineViewGrid className="mr-2 text-gray-500" />,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: <HiOutlineShoppingBag className="mr-2 text-gray-500" />,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: <HiOutlineShoppingCart className="mr-2 text-gray-500" />,
  },
  {
    name: "Checkout",
    href: "/checkout",
    icon: <HiOutlineCreditCard className="mr-2 text-gray-500" />,
  },
];

const Navbar: React.FC = () => {
  const { cartItems } = useCartStore();
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null); // New ref for Search Results
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(target)
      ) {
        clearSearch();
      }

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 py-4">
      <nav className="flex justify-between items-center">
        {/* Logo and Search */}
        <div className="flex items-center space-x-2 sm:space-x-6 flex-grow">
          <Link
            to="/"
            className="text-3xl block sm:hidden font-bold text-primary tracking-wide hover:text-primary-dark transition"
          >
            V
          </Link>
          <Link
            to="/"
            className="text-2xl hidden sm:block font-bold text-primary tracking-wide hover:text-primary-dark transition"
          >
            VERSE
          </Link>

          {/* Search Bar */}
          <div className="relative flex-grow sm:max-w-[900px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="text-gray-400" />
            </div>
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 max-w-[210px] sm:max-w-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Icons and User Section */}
        <div
          className="flex items-center space-x-4 relative sm:ml-2.5"
          ref={dropdownRef}
        >
          {/* Favorites */}
          <Link
            to="/favorites"
            className="text-gray-600 hover:text-primary transition"
          >
            <HiOutlineHeart className="text-2xl" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-primary transition"
          >
            <HiOutlineShoppingCart className="text-2xl" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="focus:outline-none"
                >
                  <img
                    src={"/assets/avatar.png"}
                    alt="User Avatar"
                    className="size-8 rounded-full ring-2 ring-primary-light"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <img
                          src={"/assets/avatar.png"}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {currentUser?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    {/* Logout */}
                    <div className="border-t border-gray-200 py-1">
                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                      >
                        <HiOutlineLogout className="mr-2 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-primary">
                <HiOutlineUser className="text-2xl" />
              </Link>
            )}
          </div>
        </div>
      </nav>
      {/* Search Results */}
      {searchTerm && (
        <div ref={searchResultsRef}>
          <SearchResults books={books || []} isLoading={isLoading} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
