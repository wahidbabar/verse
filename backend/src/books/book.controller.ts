import { Request, Response } from "express";
import Book, { IBook } from "./book.model";

interface BookRequest extends Request {
  body: Partial<IBook>;
}

// Create a new book
const postABook = async (req: BookRequest, res: Response): Promise<void> => {
  try {
    const newBook = new Book({ ...req.body });
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
const updateBook = async (req: BookRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      res.status(404).json({ message: "Book not found!" });
      return;
    }

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

export { deleteABook, getAllBooks, getSingleBook, postABook, updateBook };
