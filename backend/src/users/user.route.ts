import express, { Router } from "express";
import {
  getUserFavoriteBooks,
  loginAdmin,
  registerUser,
} from "./user.controller";
import verifyAuthToken from "../middleware/verifyAuthToken";

const router: Router = express.Router();

// Admin login route
router.post("/admin", loginAdmin);

// Optional: User registration route
router.post("/register", registerUser);

// Get user's favorite books
router.get("/favorites/:userId", verifyAuthToken, getUserFavoriteBooks);

export default router;
