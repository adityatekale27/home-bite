import Meal from "../models/meal.model.js";
import Order from "../models/order.model.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { businessId, mealItems, deliveryAddress, paymentMethod } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const processedMealItems = [];

    for (const item of mealItems) {
      const meal = await Meal.findById(item.mealId);
      if (!meal || !meal.isAvailable) {
        return res.status(400).json({ message: `Meal ${meal?.name || "unknown"} is not available` });
      }

      const itemTotal = meal.price * item.quantity;
      totalAmount += itemTotal;

      processedMealItems.push({
        mealId: item.mealId,
        quantity: item.quantity,
        price: meal.price,
      });
    }

    const order = new Order({
      customerId: req.user._id,
      businessId,
      mealItems: processedMealItems,
      deliveryAddress,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Customer Orders
export const getCustomerOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { customerId: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("businessId", "businessName businessLocation")
      .populate("mealItems.mealId")
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

// Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("customerId", "firstName lastName phoneNumber")
      .populate("businessId")
      .populate("riderId", "firstName lastName phoneNumber")
      .populate("mealItems.mealId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user has access to this order
    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole === "customer" && order.customerId._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (userRole === "chef") {
      const chefProfile = await BusinessProfile.findOne({ userId });
      if (order.businessId._id.toString() !== chefProfile._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if customer owns this order
    if (order.customerId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if order can be cancelled
    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
