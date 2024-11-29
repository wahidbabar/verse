import express, { Router } from "express";
import {
  getUserFavoriteBooks,
  loginAdmin,
  registerUser,
} from "./user.controller";

const router: Router = express.Router();

// Admin login route
router.post("/admin", loginAdmin);

// Optional: User registration route
router.post("/register", registerUser);

// Get user's favorite books
router.post("/favorites", getUserFavoriteBooks);

export default router;
