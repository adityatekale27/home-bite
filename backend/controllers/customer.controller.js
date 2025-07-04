import Menu from "../models/menu.model.js";
import CustomerProfile from "../models/customerProfile.model.js";
import BusinessProfile from "../models/businessProfile.model.js";

// Get Customer Profile
export const getCustomerProfile = async (req, res) => {
  try {
    const profile = await CustomerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Customer profile not found" });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Customer Profile
export const updateCustomerProfile = async (req, res) => {
  try {
    const profile = await CustomerProfile.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true, runValidators: true });
    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add Saved Address
export const addSavedAddress = async (req, res) => {
  try {
    const { label, location } = req.body;

    const profile = await CustomerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    profile.savedAddresses.push({ label, location });
    await profile.save();

    res.json({ message: "Address added successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Nearby Chefs
export const getNearbyChefs = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    const nearbyChefs = await BusinessProfile.find({
      businessLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radius,
        },
      },
      isBusinessApproved: true,
    }).populate("userId", "firstName lastName profileImage");

    res.json({ chefs: nearbyChefs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Today's Menus
export const getTodaysMenus = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nearbyChefs = await BusinessProfile.find({
      businessLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radius,
        },
      },
      isBusinessApproved: true,
    });

    const chefIds = nearbyChefs.map((chef) => chef._id);

    const menus = await Menu.find({
      businessId: { $in: chefIds },
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      isPublished: true,
    })
      .populate("businessId")
      .populate("mealIds");

    res.json({ menus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
