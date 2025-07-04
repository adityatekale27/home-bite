import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation
export const validateUserRegistration = [
  body("firstName").trim().isLength({ min: 2, max: 50 }).withMessage("First name must be 2-50 characters"),
  body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Last name must be 2-50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("phoneNumber").isMobilePhone().withMessage("Valid phone number required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["customer", "chef", "rider"]).withMessage("Invalid role"),
  handleValidationErrors,
];

export const validateUserLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Chef validation
export const validateChefProfile = [
  body("businessName").trim().isLength({ min: 2, max: 100 }).withMessage("Business name must be 2-100 characters"),
  body("experience").isInt({ min: 0, max: 50 }).withMessage("Experience must be 0-50 years"),
  body("specialization").isArray().withMessage("Specialization must be an array"),
  body("businessLocation.coordinates").isArray({ min: 2, max: 2 }).withMessage("Valid coordinates required"),
  body("deliveryRadius").optional().isInt({ min: 500, max: 20000 }).withMessage("Delivery radius must be 500-20000 meters"),
  handleValidationErrors,
];

// Menu validation
export const validateMenu = [
  body("date").isISO8601().withMessage("Valid date required"),
  body("title").optional().trim().isLength({ max: 200 }).withMessage("Title max 200 characters"),
  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description max 500 characters"),
  handleValidationErrors,
];

// Meal validation
export const validateMeal = [
  body("name").trim().isLength({ min: 2, max: 200 }).withMessage("Name must be 2-200 characters"),
  body("description").optional().trim().isLength({ max: 600 }).withMessage("Description max 600 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be positive number"),
  body("dietaryTags").optional().isObject().withMessage("Dietary tags must be an object"),
  handleValidationErrors,
];

// Order validation
export const validateOrder = [
  body("businessId").isMongoId().withMessage("Valid business ID required"),
  body("mealItems").isArray({ min: 1 }).withMessage("At least one meal item required"),
  body("mealItems.*.mealId").isMongoId().withMessage("Valid meal ID required"),
  body("mealItems.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be positive integer"),
  body("deliveryAddress").isObject().withMessage("Delivery address required"),
  body("paymentMethod").isIn(["cash", "card", "upi", "wallet"]).withMessage("Invalid payment method"),
  handleValidationErrors,
];

// Rating validation
export const validateRating = [
  body("orderId").isMongoId().withMessage("Valid order ID required"),
  body("businessRating").isInt({ min: 1, max: 5 }).withMessage("Business rating must be 1-5"),
  body("riderRating").optional().isInt({ min: 1, max: 5 }).withMessage("Rider rating must be 1-5"),
  body("comment").optional().trim().isLength({ max: 1000 }).withMessage("Comment max 1000 characters"),
  handleValidationErrors,
];
