import mongoose, { Aggregate } from "mongoose";
import { IOrder } from "../orders/order.model";
import { IBook } from "../books/book.model";

// Base interface for common model methods
interface BaseModel<T> extends mongoose.Model<T> {}

// Order Model interface
export interface OrderModel extends BaseModel<IOrder> {
  aggregate<T = any>(pipeline: mongoose.PipelineStage[]): Aggregate<Array<T>>;
}

// Book Model interface
export interface BookModel extends BaseModel<IBook> {
  aggregate<T = any>(pipeline: mongoose.PipelineStage[]): Aggregate<Array<T>>;
}

// Monthly sales interface
export interface MonthlySales {
  _id: string;
  totalSales: number;
  totalOrders: number;
}

// Response interface for admin stats
export interface AdminStatsResponse {
  totalOrders: number;
  totalSales: number;
  trendingBooks: number;
  totalBooks: number;
  monthlySales: MonthlySales[];
}

// Pipeline stage types for type safety
export type AggregationPipeline = mongoose.PipelineStage[];

// Specific aggregation result types
export interface SalesAggregationResult {
  _id: null;
  totalSales: number;
}

export interface TrendingBooksResult {
  trendingBooksCount: number;
}

// Type guard for checking aggregation results
export function isSalesAggregationResult(
  result: any
): result is SalesAggregationResult {
  return result && typeof result.totalSales === "number";
}
