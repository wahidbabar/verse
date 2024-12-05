import { useToggleFavoriteBook } from "@/api/books";
import { useUserFavoriteBooks } from "@/api/users";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCartStore from "@/store/cart-store";
import React from "react";
import { FaBook, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FavoriteBooks: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useCartStore();

  const { data: favorites, isLoading } = useUserFavoriteBooks(userId!);
  const toggleFavoriteBook = useToggleFavoriteBook(userId!);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center space-x-4 border-b">
          <FaHeart className="text-3xl text-red-500" />
          <CardTitle className="text-2xl md:text-3xl">
            Your Favorite Books
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {favorites?.length === 0 ? (
            <div className="p-8 text-center">
              <FaBook className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500 mb-4">
                No favorite books yet
              </p>
              <Button variant="outline" onClick={() => navigate("/")}>
                Explore Books
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[600px] w-full">
              <div className="p-4 space-y-4">
                {favorites?.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {book.title}
                      </h3>
                      <p className="text-gray-600">by {book.author}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => toggleFavoriteBook.mutate(book._id)}
                      disabled={toggleFavoriteBook.isPending}
                    >
                      <FaHeart className="mr-2" /> Unfavorite
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoriteBooks;
