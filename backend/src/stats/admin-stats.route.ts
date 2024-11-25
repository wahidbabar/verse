import express, { Router } from "express";
import { getAdminStats } from "./admin-stats.controller";
import verifyAdminToken from "../middleware/verifyAdminToken";

const router: Router = express.Router();

// Protected admin routes
router.get("/stats", verifyAdminToken, getAdminStats);

export default router;
