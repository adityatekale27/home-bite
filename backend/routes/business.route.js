import express from "express";
import { getChefProfile, updateChefProfile, createDailyMenu, addMealToMenu, getChefMenus, publishMenu, getChefOrders, updateOrderStatus } from "../controllers/business.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateChefProfile, validateMenu, validateMeal } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorize("chef"));

router.get("/profile", getChefProfile);
router.put("/profile", validateChefProfile, updateChefProfile);
router.post("/menu", validateMenu, createDailyMenu);
router.post("/menu/:menuId/meal", validateMeal, addMealToMenu);
router.get("/menus", getChefMenus);
router.put("/menu/:menuId/publish", publishMenu);
router.get("/orders", getChefOrders);
router.put("/order/:orderId/status", updateOrderStatus);

export default router;
