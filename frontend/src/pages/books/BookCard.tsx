import { useToggleFavoriteBook } from "@/api/books";
import { IBook } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import useCartStore from "@/store/cart-store";
import React from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

interface BookCardProps {
  book: IBook;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCartStore();
  const { currentUser } = useAuth();

  const toggleFavoriteBook = useToggleFavoriteBook(currentUser?.email!);

  const handleAddToCart = (product: IBook): void => {
    addToCart(product);
  };

  const handleFavorite = (bookId: string): void => {
    toggleFavoriteBook.mutate(bookId);
  };

  const handleUnfavorite = (bookId: string): void => {
    toggleFavoriteBook.mutate(bookId);
  };

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Book Image */}
        <div className="sm:w-48 sm:flex-shrink-0">
          <Link to={`/books/${book._id}`}>
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-auto rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Book Details */}
        <div className="flex flex-col flex-grow">
          {/* Title */}
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            {book.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book.description}
          </p>

          {/* Price */}
          <p className="font-medium mb-4">
            ${book.newPrice}{" "}
            <span className="line-through font-normal text-gray-500 ml-2">
              ${book.oldPrice}
            </span>
          </p>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Add to Cart */}
            <button
              onClick={() => handleAddToCart(book)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>

            {/* Favorite/Unfavorite */}
            {book.favoritedBy?.includes(currentUser?.email!) ? (
              <button
                onClick={() => handleUnfavorite(book._id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-md transition"
                disabled={toggleFavoriteBook.isPending}
              >
                <BsHeartFill className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={() => handleFavorite(book._id)}
                className="text-green-500 hover:bg-green-50 p-2 rounded-md transition"
                disabled={toggleFavoriteBook.isPending}
              >
                <BsHeart className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
