import BusinessProfile from "../models/businessProfile.model.js";
import Meal from "../models/meal.model.js";
import Menu from "../models/menu.model.js";
import Order from "../models/order.model.js";

// Get Chef Profile
export const getChefProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Chef Profile
export const updateChefProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true, runValidators: true });
    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create Daily Menu
export const createDailyMenu = async (req, res) => {
  try {
    const { date, title, description } = req.body;

    const chefProfile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!chefProfile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const menu = new Menu({
      businessId: chefProfile._id,
      date: new Date(date),
      title,
      description,
    });

    await menu.save();
    res.status(201).json({ message: "Menu created successfully", menu });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Menu already exists for this date" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add Meal to Menu
export const addMealToMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, description, price, image, dietaryTags } = req.body;

    const chefProfile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!chefProfile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const menu = await Menu.findOne({ _id: menuId, businessId: chefProfile._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const meal = new Meal({
      businessId: chefProfile._id,
      menuId,
      name,
      description,
      price,
      image,
      dietaryTags,
    });

    await meal.save();

    menu.mealIds.push(meal._id);
    await menu.save();

    res.status(201).json({ message: "Meal added successfully", meal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Chef's Menus
export const getChefMenus = async (req, res) => {
  try {
    const chefProfile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!chefProfile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const menus = await Menu.find({ businessId: chefProfile._id }).populate("mealIds").sort({ date: -1 });

    res.json({ menus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Publish Menu
export const publishMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const chefProfile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!chefProfile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const menu = await Menu.findOneAndUpdate({ _id: menuId, businessId: chefProfile._id }, { isPublished: true }, { new: true });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json({ message: "Menu published successfully", menu });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Chef Orders
export const getChefOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const chefProfile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!chefProfile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const query = { businessId: chefProfile._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("customerId", "firstName lastName phoneNumber")
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

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const chefProfile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!chefProfile) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, businessId: chefProfile._id },
      {
        status,
        ...(status === "accepted" && { acceptedAt: new Date() }),
        ...(status === "delivered" && { deliveredAt: new Date() }),
        ...(status === "cancelled" && { cancelledAt: new Date() }),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
