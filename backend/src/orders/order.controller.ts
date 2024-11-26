import { Request, Response } from "express";
import Order, { IOrder } from "./order.model";
import { Document } from "mongoose";

// Interface for Order Request
interface OrderRequest extends Request {
  body: Omit<IOrder, keyof Document>;
}

// Create a new order
const createAOrder = async (
  req: OrderRequest,
  res: Response
): Promise<void> => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get orders by email
const getOrderByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .populate("productIds");

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found for this email" });
      return;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Additional recommended function: Get single order by ID
const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("productIds");

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export { createAOrder, getOrderByEmail, getOrderById };
