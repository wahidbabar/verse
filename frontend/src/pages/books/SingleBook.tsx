import { FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  IBook,
  useFetchBookByIdQuery,
} from "../../redux/features/books/booksApi";
import { addToCart } from "../../redux/features/cart/cartSlice";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id!);

  const dispatch = useDispatch();

  const handleAddToCart = (product: IBook) => {
    dispatch(addToCart(product));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading book information
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Image Section */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105">
            <img
              src={book?.book.coverImage}
              alt={book?.book.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Book Details Section */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {book?.book.title}
          </h1>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center">
              <span className="font-semibold mr-2 text-gray-600">Author:</span>
              <span className="text-lg">{book?.book.author || "Unknown"}</span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold mr-2 text-gray-600">
                Published:
              </span>
              <span className="text-lg">
                {new Date(book?.book.createdAt!).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold mr-2 text-gray-600">
                Category:
              </span>
              <span className="text-lg capitalize">
                {book?.book?.category || "Uncategorized"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {book?.book.description}
            </p>
          </div>

          <button
            onClick={() => handleAddToCart(book?.book!)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 
            bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 transition-colors duration-300 
            shadow-md hover:shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FiShoppingCart className="text-xl" />
            <span className="font-semibold">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
