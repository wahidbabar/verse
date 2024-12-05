import mongoose, { Document, Schema } from "mongoose";

export interface IAddress {
  streetAddress: string;
  city: string;
  country?: string;
  state?: string;
  zipcode?: string;
}

export interface IOrder extends Document {
  userId: string;
  email: string;
  address: IAddress;
  phone: string;
  bookIds: mongoose.Types.ObjectId[];
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      country: String,
      state: String,
      zipcode: String,
    },
    phone: {
      type: String,
      required: true,
    },
    bookIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: String,
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` timestamps
  }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
