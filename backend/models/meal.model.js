import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 600 },
    estimatedPrepTime: { type: Number, default: 30 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: null },
    isAvailable: { type: Boolean, default: true },
    dietaryTags: {
      vegetarian: { type: Boolean, default: false },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: false },
      halal: { type: Boolean, default: false },
      nutFree: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

mealSchema.index({ businessId: 1 });
mealSchema.index({ name: 1 });
mealSchema.index({ isAvailable: 1 });
mealSchema.index({ "dietary.vegetarian": 1 });
mealSchema.index({ "dietary.vegan": 1 });

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
