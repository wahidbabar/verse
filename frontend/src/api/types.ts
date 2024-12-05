export interface IBook {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  trending?: boolean;
  favoritedBy?: string[];
  coverImage: string;
  oldPrice?: number;
  newPrice: number;
  createdAt?: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  category: string;
  trending?: boolean;
  coverImage: string;
  oldPrice?: number;
  newPrice: number;
}

export interface UpdateBookRequest extends CreateBookRequest {
  id: string;
}

export interface IAddress {
  streetAddress: string;
  city: string;
  country?: string;
  state?: string;
  zipcode?: string;
}

export interface IOrder {
  _id: string;
  name: string;
  email: string;
  address: IAddress;
  phone: number;
  productIds: string[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  userId: string;
  name: string;
  email: string;
  address: IAddress;
  phone: string;
  productIds: string[];
  totalPrice: number;
}

export interface DashboardData {
  totalBooks: number;
  totalSales: number;
  trendingBooks: number;
  totalOrders: number;
}

export interface IOrderBook {
  productId: string;
  quantity: number;
}

export type PaymentMethod = "STRIPE" | "COD";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
