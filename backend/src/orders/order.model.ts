import mongoose, { Document, Schema } from "mongoose";

// Interface for Address
interface IAddress {
  streetAddress: string;
  city: string;
  country?: string;
  state?: string;
  zipcode?: string;
}

// Interface for Order
export interface IOrder extends Document {
  name: string;
  email: string;
  address: IAddress;
  phone: number;
  productIds: mongoose.Types.ObjectId[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      streetAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: String,
      state: String,
      zipcode: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
