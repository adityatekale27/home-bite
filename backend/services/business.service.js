import mongoose from "mongoose";
import Order from "../models/Order.js";
import Rating from "../models/Rating.js";
import Meal from "../models/Meal.js";

export const getBusinessStats = async (businessId) => {
  const objectId = new mongoose.Types.ObjectId(businessId);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Run the core aggregates in parallel
  const [totalOrdersToday, totalOrdersLifetime, totalRatings, avgRatingAgg, revenueTodayAgg, topMealsAgg] = await Promise.all([
    // Total orders placed today
    Order.countDocuments({
      business: objectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }),

    // All-time orders
    Order.countDocuments({ business: objectId }),

    // Total number of ratings
    Rating.countDocuments({ business: objectId }),

    // Average rating
    Rating.aggregate([{ $match: { business: objectId } }, { $group: { _id: null, avg: { $avg: "$rating" } } }]),

    // Total revenue today (sum of order.totalAmount)
    Order.aggregate([
      {
        $match: {
          business: objectId,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]),

    // Top 3 most ordered meals (using mealItems array)
    Order.aggregate([
      { $match: { business: objectId } },
      { $unwind: "$mealItems" },
      {
        $group: {
          _id: "$mealItems.meal",
          totalOrders: { $sum: "$mealItems.quantity" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 3 },
    ]),
  ]);

  // Get top meal details
  const topMeals = [];
  for (const item of topMealsAgg) {
    const meal = await Meal.findById(item._id).select("name imageUrl price");
    if (meal) {
      topMeals.push({
        _id: meal._id,
        name: meal.name,
        price: meal.price,
        imageUrl: meal.imageUrl,
        totalOrders: item.totalOrders,
      });
    }
  }

  const averageRating = avgRatingAgg[0]?.avg ? Number(avgRatingAgg[0].avg.toFixed(1)) : 0;
  const revenueToday = revenueTodayAgg[0]?.totalRevenue || 0;

  return {
    totalOrdersToday,
    totalOrdersLifetime,
    totalRatings,
    averageRating,
    revenueToday,
    topMeals,
  };
};
