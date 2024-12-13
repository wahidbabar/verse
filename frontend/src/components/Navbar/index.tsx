import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";
import { isTokenValid } from "@/lib/utils";
import useCartStore from "@/store/cart-store";
import { fetchBooks } from "@/api/books";
import { useUserFavoriteBooks } from "@/api/users";
import { SearchBar } from "./SearchBar";
import { NavActions } from "./NavActions";
import { UserMenu } from "./UserMenu";
import SearchResults from "../SearchResults";

const Navbar = () => {
  const { cartItems, userId, clearCart, setUserId } = useCartStore();
  const queryClient = useQueryClient();
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const validToken = isTokenValid();

  const { data: favorites } = useUserFavoriteBooks(userId!);

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

  const { data: books, isLoading } = useQuery({
    queryKey: ["searchBooks", searchTerm],
    queryFn: ({ signal }) =>
      fetchBooks({ queryKey: ["searchBooks", searchTerm], signal }),
    enabled: searchTerm.trim().length > 2,
    staleTime: 1000 * 60 * 5,
  });

  const clearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUserId(null);
    clearCart();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors"
            >
              <span className="hidden sm:inline">VERSE</span>
              <span className="sm:hidden">V</span>
            </Link>

            <SearchBar
              searchTerm={searchTerm}
              onChange={handleSearchChange}
              onClear={clearSearch}
            />
          </div>

          <div className="flex items-center gap-2">
            <NavActions
              favoritesCount={favorites?.length}
              cartItemsCount={cartItems.length}
            />

            <UserMenu
              isLoggedIn={validToken}
              userEmail={currentUser?.email}
              onLogout={handleLogOut}
            />
          </div>
        </div>

        {searchTerm && (
          <div
            ref={searchResultsRef}
            className="absolute left-0 right-0 top-full mt-1 bg-background border rounded-lg shadow-lg"
          >
            <SearchResults books={books || []} isLoading={isLoading} />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
