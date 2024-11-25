import express from "express";
const { createAOrder, getOrderByEmail } = require("./order.controller");

const router = express.Router();

// create order endpoint
router.post("/", createAOrder);

// get orders by user email
router.get("/email/:email", getOrderByEmail);

export default router;
