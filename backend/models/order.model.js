import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    mealItems: [
      {
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    deliveryAddress: {
      street: String,
      area: String,
      city: String,
      state: String,
      pinCode: String,
      country: { type: String, default: "India" },
      location: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number], // [lng, lat]
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "wallet"],
      default: "cash",
    },
    paymentId: String,
    placedAt: { type: Date, default: Date.now },
    acceptedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    totalAmount: { type: Number, required: true },
    isRated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1 });
orderSchema.index({ businessId: 1 });
orderSchema.index({ riderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ placedAt: -1 });
orderSchema.index({ "deliveryAddress.location": "2dsphere" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
