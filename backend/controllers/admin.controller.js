import BusinessProfile from "../models/businessProfile.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
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

// Approve Chef Business
export const approveChefBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    const business = await BusinessProfile.findByIdAndUpdate(businessId, { isBusinessApproved: true }, { new: true });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ message: "Business approved successfully", business });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("customerId", "firstName lastName email")
      .populate("businessId", "businessName")
      .populate("riderId", "firstName lastName")
      .sort({ placedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
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

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChefs = await User.countDocuments({ role: "chef" });
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
      placedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    // Calculate total revenue
    const revenueData = await Order.aggregate([{ $match: { status: "delivered" } }, { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]);

    res.json({
      totalUsers,
      totalChefs,
      totalCustomers,
      totalOrders,
      todayOrders,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
