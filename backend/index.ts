import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./src/books/book.route";
import orderRoutes from "./src/orders/order.route";
import userRoutes from "./src/users/user.route";
import adminRoutes from "./src/stats/admin-stats.route";
import bodyParser from "body-parser";

// Load environment variables
dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "5000", 10);

// Configure CORS options
const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:5173", "https://verse-gray.vercel.app"],
  credentials: true,
};
app.use("/api/orders/webhook", bodyParser.raw({ type: "application/json" }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Database connection
async function connectDB(): Promise<void> {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("Database URL not found in environment variables");
    }

    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully!");

    // Root route
    app.get("/", (_req: Request, res: Response) => {
      res.send("Book Store Server is running!");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
