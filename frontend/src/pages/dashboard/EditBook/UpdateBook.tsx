import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";

import Loading from "../../../components/Loading";
import {
  UpdateBookRequest,
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";

// Validation Schema
const bookUpdateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  author: z.string().min(3, { message: "Author is required" }),
  category: z.string().min(3, { message: "Category is required" }),
  trending: z.boolean().optional(),
  oldPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Old price must be a positive number",
    }),
  newPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "New price must be a positive number",
    }),
  coverImage: z
    .string()
    .url({ message: "Please provide a valid image URL" })
    .optional(),
});

type BookUpdateFormData = z.infer<typeof bookUpdateSchema>;

const UpdateBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id!);
  const [updateBook] = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookUpdateFormData>({
    resolver: zodResolver(bookUpdateSchema),
  });

  useEffect(() => {
    if (bookData?.book) {
      setValue("title", bookData.book.title);
      setValue("description", bookData.book.description);
      setValue("category", bookData.book.category);
      setValue("trending", bookData.book.trending ?? false);
      setValue("oldPrice", bookData.book.oldPrice!);
      setValue("newPrice", bookData.book.newPrice!);
      setValue("coverImage", bookData.book.coverImage ?? "");
    }
  }, [bookData, setValue]);

  const onSubmit: SubmitHandler<BookUpdateFormData> = async (data) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Book ID is missing",
      });
      return;
    }

    const updateBookData: UpdateBookRequest = {
      id,
      ...data,
      oldPrice: data.oldPrice,
      newPrice: data.newPrice,
      coverImage: (data.coverImage || bookData?.book.coverImage) ?? "",
      trending: data.trending ?? false,
    };

    try {
      await updateBook(updateBookData).unwrap();
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
      await refetch();
    } catch (error) {
      console.error("Failed to update book:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update the book. Please try again.",
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center">Error fetching book data</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Book
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Title"
              name="title"
              placeholder="Enter book title"
              register={register}
              errors={errors}
            />

            <InputField
              label="Description"
              name="description"
              placeholder="Enter book description"
              type="textarea"
              register={register}
              errors={errors}
            />

            <InputField
              label="Author"
              name="author"
              placeholder="Enter book author"
              register={register}
              errors={errors}
            />

            <SelectField
              label="Category"
              name="category"
              options={[
                { value: "", label: "Choose a genre" },
                { value: "Business", label: "Business" },
                { value: "Fiction", label: "Fiction" },
                { value: "Horror", label: "Horror" },
                { value: "Adventure", label: "Adventure" },
                { value: "History", label: "History" },
                { value: "Thriller", label: "Thriller" },
                { value: "Humor", label: "Humor" },
                { value: "Cooking", label: "Cooking" },
                { value: "Literature", label: "Literature" },
                { value: "Science", label: "Science" },
                { value: "Mystery", label: "Mystery" },
                { value: "Self-Help", label: "Self-Help" },
              ]}
              register={register}
              errors={errors}
            />

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register("trending")}
                  className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  Trending
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Old Price"
                name="oldPrice"
                type="number"
                placeholder="Old Price"
                register={register}
                errors={errors}
              />

              <InputField
                label="New Price"
                name="newPrice"
                type="number"
                placeholder="New Price"
                register={register}
                errors={errors}
              />
            </div>

            <InputField
              label="Cover Image URL"
              name="coverImage"
              type="text"
              placeholder="Cover Image URL"
              register={register}
              errors={errors}
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
