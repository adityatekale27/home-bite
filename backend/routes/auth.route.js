import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateUserRegistration, validateUserLogin } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);
router.get("/profile", authenticate, getUserProfile);

export default router;
     