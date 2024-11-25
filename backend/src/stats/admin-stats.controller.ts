import { Request, Response } from "express";
import Order from "../orders/order.model";
import Book from "../books/book.model";
import {
  AdminStatsResponse,
  AggregationPipeline,
  SalesAggregationResult,
  TrendingBooksResult,
  MonthlySales,
} from "./admin-stats.model";

export const getAdminStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Total orders count
    const totalOrders: number = await Order.countDocuments();

    // Total sales aggregation pipeline
    const salesPipeline: AggregationPipeline = [
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ];

    const totalSalesResult = await Order.aggregate<SalesAggregationResult>(
      salesPipeline
    );

    // Trending books aggregation pipeline
    const trendingPipeline: AggregationPipeline = [
      { $match: { trending: true } },
      { $count: "trendingBooksCount" },
    ];

    const trendingBooksResult = await Book.aggregate<TrendingBooksResult>(
      trendingPipeline
    );

    // Total books count
    const totalBooks: number = await Book.countDocuments();

    // Monthly sales aggregation pipeline
    const monthlySalesPipeline: AggregationPipeline = [
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const monthlySales = await Order.aggregate<MonthlySales>(
      monthlySalesPipeline
    );

    // Prepare response
    const response: AdminStatsResponse = {
      totalOrders,
      totalSales: totalSalesResult[0]?.totalSales || 0,
      trendingBooks: trendingBooksResult[0]?.trendingBooksCount || 0,
      totalBooks,
      monthlySales,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      message: "Failed to fetch admin stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
