import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    date: { type: Date, trim: true, required: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    mealIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Unique menu per day per business
menuSchema.index({ businessId: 1, date: 1 }, { unique: true });
menuSchema.index({ isPublished: 1 });
menuSchema.index({ date: 1 });

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
