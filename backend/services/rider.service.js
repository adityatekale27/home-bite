import DeliveryBoyProfile from "../models/DeliveryBoyProfile.js";

/**
 * Finds available and approved riders within a specific distance of a given location
 * @param {Array} coordinates - [longitude, latitude] of the restaurant
 * @param {number} maxDistance - Max distance in meters (default: 3000 = 3km)
 * @param {number} limit - Max number of riders to return (default: 5)
 * @returns {Promise<Array>} List of nearby rider profiles
 */
export const findNearbyRiders = async (coordinates, maxDistance = 3000, limit = 5) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new Error("Invalid coordinates provided to findNearbyRiders");
  }

  const riders = await DeliveryBoyProfile.find({
    isOnline: true,
    isAvailable: true,
    approvalStatus: "approved",
    currentLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        $maxDistance: maxDistance,
      },
    },
  }).limit(limit);

  return riders;
};

/**
 * Get full rider performance and financial statistics
 * @param {string|ObjectId} riderUserId
 * @returns {Promise<Object>} stats object
 */
export const getRiderStats = async (riderUserId) => {
  const userId = new mongoose.Types.ObjectId(riderUserId);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [deliveriesToday, totalDeliveries, successfulDeliveries, totalEarningsAgg, earningsTodayAgg, ratingsAgg] = await Promise.all([
    // Orders delivered today
    Order.countDocuments({
      rider: userId,
      status: "delivered",
      deliveredAt: { $gte: startOfDay, $lte: endOfDay },
    }),

    // Lifetime deliveries
    Order.countDocuments({ rider: userId }),

    // Successful deliveries (not cancelled)
    Order.countDocuments({
      rider: userId,
      status: "delivered",
    }),

    // Total earnings
    Order.aggregate([{ $match: { rider: userId, status: "delivered" } }, { $group: { _id: null, total: { $sum: "$riderEarning" } } }]),

    // Earnings today
    Order.aggregate([
      {
        $match: {
          rider: userId,
          status: "delivered",
          deliveredAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: "$riderEarning" } } },
    ]),

    // Ratings
    Rating.aggregate([
      { $match: { rider: userId } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const averageRating = ratingsAgg[0]?.avg ? Number(ratingsAgg[0].avg.toFixed(1)) : 0;
  const totalRatings = ratingsAgg[0]?.count || 0;
  const totalEarnings = totalEarningsAgg[0]?.total || 0;
  const earningsToday = earningsTodayAgg[0]?.total || 0;

  return {
    deliveriesToday,
    totalDeliveries,
    successfulDeliveries,
    averageRating,
    totalRatings,
    totalEarnings,
    earningsToday,
  };
};