import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mealsRated: [
      {
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
      },
    ],
    businessRating: { type: Number, min: 1, max: 5 },
    riderRating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

ratingSchema.index({ businessId: 1 });
ratingSchema.index({ riderId: 1 });
ratingSchema.index({ orderId: 1 });
ratingSchema.index({ customerId: 1 });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
