import React from "react";
import { BiEdit } from "react-icons/bi";
import { BsTrash2 } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  useDeleteBookMutation,
  useFetchAllBooksQuery,
} from "../../../redux/features/books/booksApi";

const ManageBooks: React.FC = () => {
  const { data, refetch, isLoading, isError } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  // Handle deleting a book with improved error handling
  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id).unwrap();

      // Use a more modern notification method
      alert("Book deleted successfully!");
      refetch();
    } catch (error: any) {
      console.error("Failed to delete book:", error.message);
      alert(`Failed to delete book: ${error.message}`);
    }
  };

  // Render loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          Unable to load books. Please try again later.
        </span>
      </div>
    );
  }

  if (!data) {
    <div className="h-full flex items-center justify-center">
      <FiLoader className="size-5 animate-spin text-muted-foreground" />
    </div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Manage Books
          </h2>
          <Link
            to="/dashboard/add-book"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add New Book
          </Link>
        </div>

        {data?.books.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No books found. Add some books to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {["#", "Book Title", "Category", "Price", "Actions"].map(
                    (header, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.books.map((book, index) => (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.category}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${book.newPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/dashboard/edit-book/${book._id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <BiEdit className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <BsTrash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
