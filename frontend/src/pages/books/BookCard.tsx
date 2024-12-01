import { useToggleFavoriteBook } from "@/api/books";
import { IBook } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import useCartStore from "@/store/cart-store";
import React, { useState } from "react";
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

  const [isFavorite, setIsFavorite] = useState(
    book.favoritedBy?.includes(currentUser?.email!) || false
  );

  const handleAddToCart = (product: IBook): void => {
    addToCart(product);
  };

  const handleToggleFavorite = (bookId: string): void => {
    setIsFavorite(!isFavorite);

    toggleFavoriteBook.mutate(bookId, {
      onError: () => {
        setIsFavorite((prev) => !prev);
      },
    });
  };

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="sm:w-48 sm:flex-shrink-0">
          <Link to={`/books/${book._id}`}>
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-auto rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        <div className="flex flex-col flex-grow">
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-4">
            {book.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book.description}
          </p>

          <p className="font-medium mb-4">
            ${book.newPrice}{" "}
            <span className="line-through font-normal text-gray-500 ml-2">
              ${book.oldPrice}
            </span>
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAddToCart(book)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>

            {currentUser &&
              (isFavorite ? (
                <button
                  onClick={() => handleToggleFavorite(book._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-md transition"
                  disabled={toggleFavoriteBook.isPending}
                >
                  <BsHeartFill className="h-6 w-6" />
                </button>
              ) : (
                <button
                  onClick={() => handleToggleFavorite(book._id)}
                  className="text-green-500 hover:bg-green-50 p-2 rounded-md transition"
                  disabled={toggleFavoriteBook.isPending}
                >
                  <BsHeart className="h-6 w-6" />
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
