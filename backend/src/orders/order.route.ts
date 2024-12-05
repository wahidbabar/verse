import express from "express";
import {
  getOrdersByUserId,
  getOrderById,
  createCheckoutSession,
  handleWebhook,
  createCashOnDeliveryOrder,
} from "./order.controller";
import verifyAuthToken from "../middleware/verifyAuthToken";

const router = express.Router();

// Public webhook route (no authentication)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// All other routes require authentication
router.post("/cod", verifyAuthToken, createCashOnDeliveryOrder);
router.get("/user/:userId", verifyAuthToken, getOrdersByUserId);
router.get("/:id", verifyAuthToken, getOrderById);
router.post("/create-checkout-session", verifyAuthToken, createCheckoutSession);

export default router;
