import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import envConfig from "../config/env.js";
import User from "../models/user.model.js";
import CustomerProfile from "../models/customerProfile.model.js";
import BusinessProfile from "../models/businessProfile.model.js";
import RiderProfile from "../models/riderProfile.model.js";

// Generate JWT Token
const generateToken = (userId) => {
  if (!userId) throw new Error("User ID is required for token generation");
  return jwt.sign({ userId }, envConfig.JWT_TOKEN_SECRET, { expiresIn: envConfig.JWT_TOKEN_TTL || "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role = "customer" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      emailVerificationToken: crypto.randomBytes(32).toString("hex"),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await user.save();

    // Create role-specific profile
    if (role === "customer") {
      await CustomerProfile.create({ userId: user._id });
    } else if (role === "chef") {
      await BusinessProfile.create({ userId: user._id });
    } else if (role === "rider") {
      await RiderProfile.create({ userId: user._id });
    } else {
      throw new Error("Failed to create role profile")
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if account is active
    if (!user.isAccountActive) {
      return res.status(400).json({ message: "Account is deactivated" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    console.log(req)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
