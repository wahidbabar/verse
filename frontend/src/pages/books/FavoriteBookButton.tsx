import { useToggleFavoriteBook } from "@/api/books";
import React, { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface FavoriteBookButtonProps {
  userId: string;
  bookId: string;
  favoritedBy: string[];
}

const FavoriteBookButton: React.FC<FavoriteBookButtonProps> = ({
  userId,
  bookId,
  favoritedBy,
}) => {
  const [isFavorite, setIsFavorite] = useState(
    favoritedBy?.includes(userId) ?? false
  );
  const toggleFavoriteBook = useToggleFavoriteBook(userId);

  if (bookId === "673a0832909a8290b2fa1b7d") {
    console.log(favoritedBy, userId, isFavorite);
  }

  const handleToggleFavorite = (): void => {
    setIsFavorite(!isFavorite);

    toggleFavoriteBook.mutate(bookId, {
      onError: () => {
        setIsFavorite((prev) => !prev);
      },
    });
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`
        p-2 rounded-md transition 
        ${
          isFavorite
            ? "text-red-500 hover:bg-red-50"
            : "text-green-500 hover:bg-green-50"
        }
      `}
      disabled={toggleFavoriteBook.isPending}
    >
      {isFavorite ? (
        <BsHeartFill className="h-6 w-6" />
      ) : (
        <BsHeart className="h-6 w-6" />
      )}
    </button>
  );
};

export default FavoriteBookButton;
