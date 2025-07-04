import express from "express";
import { getAllUsers, approveChefBusiness, getAllOrders, getDashboardStats } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.put("/approve-business/:businessId", approveChefBusiness);
router.get("/orders", getAllOrders);
router.get("/dashboard-stats", getDashboardStats);

export default router;
