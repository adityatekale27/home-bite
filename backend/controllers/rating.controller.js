import Order from "../models/order.model.js";
import Rating from "../models/rating.model.js";

// Create Rating
export const createRating = async (req, res) => {
  try {
    const { orderId, businessRating, riderRating, mealsRated, comment } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Can only rate delivered orders" });
    }

    if (order.isRated) {
      return res.status(400).json({ message: "Order already rated" });
    }

    const rating = new Rating({
      orderId,
      customerId: req.user.userId,
      businessId: order.businessId,
      riderId: order.riderId,
      businessRating,
      riderRating,
      mealsRated,
      comment,
    });

    await rating.save();

    // Update order as rated
    order.isRated = true;
    await order.save();

    res.status(201).json({ message: "Rating submitted successfully", rating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Business Ratings
export const getBusinessRatings = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ businessId })
      .populate("customerId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Rating.countDocuments({ businessId });

    // Calculate average rating
    const avgRating = await Rating.aggregate([{ $match: { businessId: mongoose.Types.ObjectId(businessId) } }, { $group: { _id: null, avgRating: { $avg: "$businessRating" } } }]);

    res.json({
      ratings,
      averageRating: avgRating[0]?.avgRating || 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
