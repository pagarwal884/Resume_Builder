import User from "../models/userModels.js";   // Import User model (MongoDB collection)
import bcrypt from "bcryptjs";                // For hashing & comparing passwords
import jwt from "jsonwebtoken";               // For JWT token generation & verification

// ===================== JWT Token Generator ===================== //
// Takes a userID and signs it with a secret key, valid for 7 days
const generateToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",  // Token expiry duration
  });
};

// ===================== REGISTER ===================== //
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Extract data from request body

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Enforce password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send success response with JWT
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Catch any server/database errors
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===================== LOGIN ===================== //
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract credentials

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Send success response with JWT
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Catch errors (DB, JWT, bcrypt, etc.)
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===================== GET USER PROFILE ===================== //
// Protected route (requires JWT middleware to attach req.user)
export const getUserProfile = async (req, res) => {
  try {
    // Find user by ID (from req.user set by protect middleware) and exclude password
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send profile data
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
