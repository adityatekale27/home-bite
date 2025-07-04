import express from "express";
import { getCustomerProfile, updateCustomerProfile, addSavedAddress, getNearbyChefs, getTodaysMenus } from "../controllers/customer.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorize("customer"));

router.get("/profile", getCustomerProfile);
router.put("/profile", updateCustomerProfile);
router.post("/address", addSavedAddress);
router.get("/nearby-chefs", getNearbyChefs);
router.get("/menus", getTodaysMenus);

export default router;
