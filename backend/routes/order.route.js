import express from "express";
import { createOrder, getCustomerOrders, getOrderById, cancelOrder } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateOrder } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Protect all routes
router.use(authenticate);

router.post("/", validateOrder, createOrder);
router.get("/my-orders", getCustomerOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId/cancel", cancelOrder);

export default router;
