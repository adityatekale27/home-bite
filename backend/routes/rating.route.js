import express from "express";
import { createRating, getBusinessRatings } from "../controllers/rating.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRating } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/", authenticate, validateRating, createRating);
router.get("/business/:businessId", getBusinessRatings);

export default router;
