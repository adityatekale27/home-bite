import mongoose from "mongoose";

const customerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    savedAddresses: [
      {
        label: { type: String, required: true },
        location: {
          type: { type: String, enum: ["Point"], required: true },
          coordinates: { type: [Number], required: true },
          address: {
            street: { type: String, required: true },
            area: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pinCode: { type: String, required: true },
            country: { type: String, default: "India" },
          },
          deliveryInstructions: String,
          contactPersonName: String,
          contactPersonPhone: String,
          isDefault: { type: Boolean, default: false },
        },
      },
    ],
    preferences: {
      language: { type: String, default: "english" },
      notifications: { email: { type: Boolean, default: true }, sms: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
      dietary: {
        vegetarian: { type: Boolean, default: false },
        vegan: { type: Boolean, default: false },
        glutenFree: { type: Boolean, default: false },
        halal: { type: Boolean, default: false },
        nutFree: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

customerProfileSchema.index({ userId: 1 });
customerProfileSchema.index({ "savedAddresses.location": "2dsphere" });

const CustomerProfile = mongoose.model("CustomerProfile", customerProfileSchema);
export default CustomerProfile;
