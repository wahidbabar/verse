import { IBook } from "@/api/types";
import useCartStore from "@/store/cart-store";
import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import FavoriteBookButton from "./FavoriteBookButton";

interface BookCardProps {
  book: IBook;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart, userId } = useCartStore();

  const handleAddToCart = (product: IBook): void => {
    addToCart(product);
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

            {userId && book.favoritedBy && (
              <FavoriteBookButton
                userId={userId}
                bookId={book._id}
                favoritedBy={book.favoritedBy!}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
