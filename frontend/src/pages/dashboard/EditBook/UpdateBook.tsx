import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, ChangeEvent, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import Loading from "../../../components/Loading";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useFetchBookById } from "@/api/books";
import { UpdateBookRequest } from "@/api/types";
import { useUpdateBook } from "@/api/admin-book";

export const bookUpdateSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    author: z
      .string()
      .min(3, { message: "Author must be at least 3 characters" }),
    category: z.string().min(1, { message: "Category is required" }),
    trending: z.boolean().optional().default(false),
    oldPrice: z.coerce
      .number()
      .positive({ message: "Old price must be a positive number" }),
    newPrice: z.coerce
      .number()
      .positive({ message: "New price must be a positive number" }),
    coverImage: z
      .union([z.instanceof(File), z.string().url().optional()])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPrice > data.oldPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPrice"],
        message: "New price must be less than or equal to old price",
      });
    }
  });

type BookUpdateFormData = z.infer<typeof bookUpdateSchema>;

const categoryOptions: { value: string; label: string }[] = [
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
];

const UpdateBook: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");

  const { id } = useParams<{ id: string }>();
  const {
    data: book,
    isLoading: isFetching,
    isError,
    refetch,
  } = useFetchBookById(id!);
  const updateBook = useUpdateBook();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookUpdateFormData>({
    resolver: zodResolver(bookUpdateSchema),
    defaultValues: {
      trending: false,
    },
  });

  // File change handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  // Populate form with existing book data
  useEffect(() => {
    if (book) {
      setValue("title", book.title);
      setValue("description", book.description);
      setValue("author", book.author);
      setValue("category", book.category);
      setValue("trending", book.trending ?? false);
      setValue("oldPrice", book.oldPrice!);
      setValue("newPrice", book.newPrice!);
      setImageFileName(book.coverImage.url ?? "");
    }
  }, [book, setValue]);

  const onSubmit: SubmitHandler<BookUpdateFormData> = async (data) => {
    if (!id) {
      toast.error("Error", {
        description: "Book ID is missing",
        position: "top-right",
      });
      return;
    }

    // Validate image upload
    if (!imageFileName && !book?.coverImage.url) {
      toast.error("Please upload a cover image");
      return;
    }

    const updateBookData: UpdateBookRequest = {
      id,
      ...data,
      coverImage: imageFile,
    };

    try {
      setIsLoading(true);
      updateBook.mutate(updateBookData);

      toast.success("Book Updated", {
        description: "Your book is updated successfully!",
        position: "top-right",
        duration: 5000,
        action: {
          label: "Okay",
          onClick: () => {}, // Optional additional action
        },
      });

      reset();
      setImageFileName("");
      setImageFile(null);
      await refetch();
    } catch (error) {
      console.error("Failed to update book:", error);
      toast.error("Update Failed", {
        description: "Unable to update the book. Please try again.",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center">Error fetching book data</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
              options={categoryOptions}
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

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Old Price"
                name="oldPrice"
                type="text"
                placeholder="Old Price"
                register={register}
                errors={errors}
              />

              <InputField
                label="New Price"
                name="newPrice"
                type="text"
                placeholder="New Price"
                register={register}
                errors={errors}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imageFileName && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {imageFileName}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-md 
                hover:bg-blue-700 transition-colors duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
