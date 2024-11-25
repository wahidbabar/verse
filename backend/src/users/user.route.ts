import express, { Router } from "express";
import { loginAdmin, registerUser } from "./user.controller";

const router: Router = express.Router();

// Admin login route
router.post("/admin", loginAdmin);

// Optional: User registration route
router.post("/register", registerUser);

export default router;
