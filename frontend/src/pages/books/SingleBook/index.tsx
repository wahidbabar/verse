import { useParams } from "react-router-dom";
import { useFetchBookById } from "@/api/books";
import useCartStore from "@/store/cart-store";
import { BookImage } from "./BookImage";
import { BookActions } from "./BookActions";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { BookDetails } from "./BookDetails";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookById(id!);
  const { addToCart } = useCartStore();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[400px,1fr] gap-8">
          <div className="space-y-6">
            <BookImage imageUrl={book?.coverImage.url!} title={book?.title!} />
            <BookActions book={book!} onAddToCart={addToCart} />
          </div>

          <BookDetails
            title={book?.title!}
            author={book?.author!}
            category={book?.category!}
            createdAt={book?.createdAt!}
            description={book?.description!}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
