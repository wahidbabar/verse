import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the Book document
export interface IBook extends Document {
  title: string;
  description: string;
  category: string;
  author: string;
  trending: boolean;
  coverImage: string;
  oldPrice: number;
  newPrice: number;
  createdAt?: Date;
  updatedAt?: Date; // This is included because of `timestamps: true`
}

// Define the schema for the Book model
const bookSchema: Schema<IBook> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    trending: {
      type: Boolean,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Book model
const Book: Model<IBook> = mongoose.model<IBook>("Book", bookSchema);

export default Book;
