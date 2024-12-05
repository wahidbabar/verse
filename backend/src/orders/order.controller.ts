import dotenv from "dotenv";
import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../config/stripeConfig";
import Order from "./order.model";
import Book from "../books/book.model";

dotenv.config();

// Interface for creating an order request
interface OrderRequest extends Request {
  body: {
    userId: string;
    email: string;
    address: {
      streetAddress: string;
      city: string;
      country?: string;
      state?: string;
      zipcode?: string;
    };
    phone: string;
    bookIds: string[];
    totalPrice: number;
    stripeSessionId?: string;
  };
}

// Interface for Stripe Checkout Session Request
interface CheckoutSessionRequest extends Request {
  body: {
    userId: string;
    address: {
      streetAddress: string;
      city: string;
      country?: string;
      state?: string;
      zipcode?: string;
    };
    books: {
      productId: string;
      quantity: number;
    }[];
    phone: string;
  };
}

const createCheckoutSession = async (
  req: CheckoutSessionRequest,
  res: Response
): Promise<void> => {
  const { userId, address, books, phone } = req.body;

  try {
    const bookDetails = await Book.find({
      _id: { $in: books.map((b) => b.productId) },
    });

    if (bookDetails.length === 0) {
      res.status(404).json({ message: "Books not found" });
      return;
    }

    // Explicitly type the line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      bookDetails
        .map((book) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: book.title,
              },
              unit_amount: Math.round(book.newPrice * 100),
            },
            quantity: 1,
          } as Stripe.Checkout.SessionCreateParams.LineItem;
        })
        .filter(
          (item): item is Stripe.Checkout.SessionCreateParams.LineItem =>
            item !== null
        );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        userId,
        address: JSON.stringify(address),
        books: JSON.stringify(books),
        phone,
      },
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Checkout session creation failed" });
  }
};

// Create a new order
const createAOrder = async (
  req: OrderRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      email,
      address,
      phone,
      bookIds,
      totalPrice,
      stripeSessionId,
    } = req.body;

    const newOrder = new Order({
      userId,
      email,
      address,
      phone,
      bookIds,
      totalPrice,
      stripeSessionId,
      paymentStatus: "pending",
    });

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get orders by userId with book details
const getOrdersByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found for this user" });
      return;
    }

    // Fetch book details for each order
    const ordersWithBooks = await Promise.all(
      orders.map(async (order) => {
        const books = await Book.find({ _id: { $in: order.bookIds } });
        return { ...order.toObject(), books };
      })
    );

    res.status(200).json(ordersWithBooks);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order by ID with book details
const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Fetch book details for the order
    const books = await Book.find({ _id: { $in: order.bookIds } });
    const orderWithBooks = { ...order.toObject(), books };

    res.status(200).json(orderWithBooks);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

const createCashOnDeliveryOrder = async (req: Request, res: Response) => {
  const { userId, email, address, phone, bookIds, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      userId,
      email,
      address,
      phone,
      bookIds,
      totalPrice,
      paymentStatus: "pending", // COD orders start with "pending"
    });

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating COD order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  // Cast req.body to Buffer for Stripe webhook verification
  const payload = req.body as Buffer;
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    res.status(400).send("Missing Stripe signature");
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload, // Use raw payload (Buffer)
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error("Webhook signature verification failed.", err);
    res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const metadata = session.metadata || {};

        const userId = metadata.userId;
        const address = metadata.address ? JSON.parse(metadata.address) : {};
        const books = metadata.books ? JSON.parse(metadata.books) : [];
        const phone = metadata.phone;
        const newOrder = new Order({
          userId,
          email: session.customer_details?.email,
          address,
          phone,
          bookIds: books.map((b: any) => b.productId),
          totalPrice: (session.amount_total || 0) / 100,
          stripeSessionId: session.id,
          paymentStatus: "paid",
        });

        await newOrder.save();
        break;
      }
      default:
    }

    res.status(200).send("Event processed");
  } catch (error: unknown) {
    console.error("Error handling webhook event:", error);
    res.status(500).send("Webhook handler failed");
  }
};

export {
  createCashOnDeliveryOrder,
  createAOrder,
  createCheckoutSession,
  getOrderById,
  getOrdersByUserId,
  handleWebhook,
};
