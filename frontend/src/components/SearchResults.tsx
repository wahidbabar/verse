import { Link } from "react-router-dom";
import Loading from "./Loading";
import { IBook } from "@/api/types";

interface SearchResultsProps {
  books: IBook[];
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ books, isLoading }) => {
  if (isLoading) return <Loading />;
  return (
    <div className="bg-white shadow-lg rounded-lg mt-2 p-4">
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book._id} className="py-2 border-b last:border-none">
              <Link
                to={`/books/${book._id}`}
                className="flex items-center space-x-4 text-gray-700 hover:text-primary"
              >
                {/* Book Image */}
                {book.coverImage.url && (
                  <img
                    src={book.coverImage.url}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                )}
                {/* Book Title */}
                <span>{book.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No books found.</p>
      )}
    </div>
  );
};

export default SearchResults;
