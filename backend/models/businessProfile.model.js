import mongoose from "mongoose";

const businessProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true, trim: true },
    businessProfileImage: { type: String, default: null },
    businessBio: { type: String, trim: true, maxlength: 500 },
    experience: { type: Number, required: true, min: 0, max: 50 },
    specialization: {
      type: [String],
      enum: ["North Indian", "South Indian", "Maharashtrian", "Gujarati", "Bengali", "Chinese", "Italian", "Tandoori", "Bakery & Desserts", "Other"],
    },
    businessLocation: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
      address: {
        street: { type: String, required: true },
        area: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String, default: "India" },
      },
    },
    deliveryRadius: { type: Number, default: 5000, min: 500, max: 20000 }, // default 5km in meters
    isBusinessApproved: { type: Boolean, default: false },
    operatingHours: {
      monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
      sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    },
    stripeAccountId: { type: String },
    isStripeVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster query
businessProfileSchema.index({ businessLocation: "2dsphere" });
businessProfileSchema.index({ userId: 1 });
businessProfileSchema.index({ businessName: 1 });
businessProfileSchema.index({ isBusinessApproved: 1 });
businessProfileSchema.index({ specialization: 1 });

const BusinessProfile = mongoose.model("BusinessProfile", businessProfileSchema);
export default BusinessProfile;
