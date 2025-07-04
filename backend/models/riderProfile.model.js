import mongoose from "mongoose";

const riderProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    vehicleType: { type: String, enum: ["bicycle", "motorbike", "scooter"] },
    vehicleNumber: { type: String, required: true, unique: true },
    drivingLicense: { type: String, required: true }, // image
    isOnline: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isRiderVerified: { type: Boolean, default: false },
    emergencyContact: { name: String, phone: String, relationship: String },
    currentLocation: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
      lastUpdated: { type: Date, default: Date.now },
    },
    preferences: {
      language: { type: String, default: "english" },
      notifications: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    },
  },
  { timestamps: true }
);

riderProfileSchema.index({ userId: 1 });
riderProfileSchema.index({ currentLocation: "2dsphere" });
riderProfileSchema.index({ isOnline: 1, isAvailable: 1 });
riderProfileSchema.index({ isRiderVerified: 1 });

const RiderProfile = mongoose.model("RiderProfile", riderProfileSchema);
export default RiderProfile;
