import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import Book from "./book.model";

const postABook = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file exists
    if (!req.file) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bookstore",
      resource_type: "image",
    });

    // Create new book with Cloudinary image details
    const newBook = new Book({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category,
      trending: req.body.trending === true,
      oldPrice: req.body.oldPrice,
      newPrice: req.body.newPrice,
      coverImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    // Save book to database
    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Book posted successfully",
      book: savedBook,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Failed to create book" });
  }
};

// Fetch all books
const getAllBooks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// Fetch a single book by ID
const getSingleBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({ message: "Book not found!" });
      return;
    }

    res.status(200).json({
      message: "Book retrieved successfully",
      book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Failed to fetch book" });
  }
};

// Update a book
const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the existing book
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      res.status(404).json({ message: "Book not found!" });
      return;
    }

    // Prepare updated data
    const updatedData: Partial<typeof existingBook> = {
      ...req.body, // Include all fields from the request body
    };

    // Check if a new file is provided
    if (req.file) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bookstore",
        resource_type: "image",
      });

      // Add Cloudinary details to `coverImage`
      updatedData.coverImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // Optionally, you can delete the old image from Cloudinary
      if (existingBook.coverImage?.public_id) {
        await cloudinary.uploader.destroy(existingBook.coverImage.public_id);
      }
    }

    // Update the book in the database
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Failed to update book" });
  }
};

// Delete a book
const deleteABook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      res.status(404).json({ message: "Book not found!" });
      return;
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Failed to delete book" });
  }
};

const searchBooks = async (req: Request, res: Response) => {
  try {
    const {
      query = "",
      page = 1,
      limit = 10,
      category = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate and sanitize inputs
    const pageNumber = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNumber = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 10)
    );

    const searchRegex = new RegExp(String(query).trim(), "i");

    const filter: any = {
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
      ],
    };

    // Add category filter if provided
    if (category) {
      filter.category = String(category).trim();
    }

    // Validate sortBy to prevent injection
    const validSortFields = ["title", "author", "createdAt", "price"];
    const safeSortBy = validSortFields.includes(String(sortBy))
      ? String(sortBy)
      : "createdAt";

    const options = {
      skip: (pageNumber - 1) * limitNumber,
      limit: limitNumber,
      sort: { [safeSortBy]: sortOrder === "desc" ? -1 : 1 },
    };

    // Fetch books and count in parallel
    const [books, total] = await Promise.all([
      Book.find(filter, null, options),
      Book.countDocuments(filter),
    ]);

    res.json({
      books,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalBooks: total,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Server error during book search",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Toggle Favorite a book
const toggleFavoriteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Book ID
    const { userId } = req.body; // User email

    if (!userId) {
      res.status(400).json({ message: "User email is required" });
      return;
    }

    // Find the book by ID
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: "Book not found!" });
      return;
    }

    // Ensure favoritedBy array exists
    if (!book.favoritedBy) book.favoritedBy = [];

    // Check if the book is already favorited by the user
    if (book.favoritedBy.includes(userId)) {
      // If already favorited, remove the email to unfavorite
      book.favoritedBy = book.favoritedBy.filter(
        (userEmail) => userEmail !== userId
      );
      await book.save();
      res.status(200).json({
        message: "Book unfavorited successfully",
        book,
      });
    } else {
      // If not favorited, add the email to favorite
      book.favoritedBy.push(userId);
      await book.save();
      res.status(200).json({
        message: "Book favorited successfully",
        book,
      });
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    res.status(500).json({ message: "Failed to toggle favorite status" });
  }
};

export {
  deleteABook,
  getAllBooks,
  getSingleBook,
  postABook,
  searchBooks,
  toggleFavoriteBook,
  updateBook,
};
