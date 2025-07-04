import User from "../models/user.model";

export class UserHelpers {
  // Get user with their specific profile
  static async getUserWithProfile(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    let profile = null;

    switch (user.role) {
      case "chef":
        profile = await ChefProfile.findOne({ userId }).populate("userId");
        break;
      case "delivery_boy":
        profile = await DeliveryBoyProfile.findOne({ userId }).populate("userId");
        break;
      case "admin":
        profile = await AdminProfile.findOne({ userId }).populate("userId");
        break;
      case "customer":
        profile = await CustomerProfile.findOne({ userId }).populate("userId");
        break;
    }

    return {
      user,
      profile,
    };
  }

  // Create user with profile
  static async createUserWithProfile(userData, profileData) {
    const user = new User(userData);
    await user.save();

    let profile = null;

    switch (user.role) {
      case "chef":
        profile = new ChefProfile({ userId: user._id, ...profileData });
        break;
      case "delivery_boy":
        profile = new DeliveryBoyProfile({ userId: user._id, ...profileData });
        break;
      case "admin":
        profile = new AdminProfile({ userId: user._id, ...profileData });
        break;
      case "customer":
        profile = new CustomerProfile({ userId: user._id, ...profileData });
        break;
    }

    if (profile) {
      await profile.save();
    }

    return { user, profile };
  }
}
