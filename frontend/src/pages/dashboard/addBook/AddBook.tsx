import React, { useState, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { CreateBookRequest } from "@/api/types";
import { useAddBook } from "@/api/admin-book";

const AddBook: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Form hook with type safety
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBookRequest>({
    defaultValues: {
      trending: false,
    },
  });

  // State for image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");

  // Mutation hook
  const addBook = useAddBook();

  // File change handler with type safety
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  // Form submission handler
  const onSubmit: SubmitHandler<CreateBookRequest> = async (data) => {
    // Validate image upload
    if (!imageFileName) {
      toast.error("Please upload a cover image");
      return;
    }

    const newBookData = {
      ...data,
      coverImage: imageFile,
    };

    try {
      setIsLoading(true);
      addBook.mutate(newBookData);

      toast.success("Book Added", {
        description: "Your book is uploaded successfully!",
        duration: 5000,
        action: {
          label: "Okay",
          onClick: () => {}, // Optional additional action
        },
      });

      // Reset form and image states
      reset();
      setImageFileName("");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Add Book", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Category options
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

  return (
    <div className="max-w-lg w-full mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Add New Book
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Input */}
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
          errors={errors}
          validation={{
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          }}
        />

        {/* Description Input */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          register={register}
          errors={errors}
          validation={{
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          }}
        />

        {/* Book Author */}
        <InputField
          label="Author"
          name="author"
          type="text"
          placeholder="Enter book author"
          register={register}
          errors={errors}
          validation={{
            required: "Author is required",
            minLength: {
              value: 3,
              message: "Author must be at least 3 characters",
            },
          }}
        />

        {/* Category Select */}
        <SelectField
          label="Category"
          name="category"
          options={categoryOptions}
          register={register}
          errors={errors}
          validation={{
            required: "Please select a category",
          }}
        />

        {/* Trending Checkbox */}
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

        {/* Price Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Old Price"
            name="oldPrice"
            type="text"
            placeholder="Old Price"
            register={register}
            errors={errors}
            validation={{
              required: "Old price is required",
              min: {
                value: 0,
                message: "Price cannot be negative",
              },
            }}
          />

          <InputField
            label="New Price"
            name="newPrice"
            type="text"
            placeholder="New Price"
            register={register}
            errors={errors}
            validation={{
              required: "New price is required",
              min: {
                value: 0,
                message: "Price cannot be negative",
              },
              validate: (value: number, formValues: CreateBookRequest) =>
                value <= Number(formValues.oldPrice!) ||
                "New price must be less than or equal to old price",
            }}
          />
        </div>

        {/* Cover Image Upload */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-500 text-white font-bold rounded-md 
            hover:bg-green-600 transition-colors duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
