import { useToggleFavoriteBook } from "@/api/books";
import { useUserFavoriteBooks } from "@/api/users";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const FavoriteBooks: React.FC = () => {
  const { currentUser } = useAuth();

  const { data: favorites, isLoading } = useUserFavoriteBooks(
    currentUser?.email!
  );
  const toggleFavoriteBook = useToggleFavoriteBook(currentUser?.email!);

  if (isLoading || !currentUser) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Your Favorite Books
        </h1>

        {favorites?.length === 0 ? (
          <p className="text-center text-gray-500">
            No favorite books yet. Start exploring!
          </p>
        ) : (
          <ul className="space-y-4">
            {favorites?.map((book) => (
              <li
                key={book._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border shadow-sm transition-transform transform hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {book.title}
                    </h3>
                    <p className="text-gray-600">by {book.author}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => toggleFavoriteBook.mutate(book._id)}
                    disabled={toggleFavoriteBook.isPending}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-500 bg-red-100 hover:bg-red-200 rounded-lg transition disabled:opacity-50"
                  >
                    Unfavorite
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FavoriteBooks;
