import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// [commit: added JWT token generator helper function]
// GENERATE A TOKEN (JWT)
const generateToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ===================== REGISTER ===================== //
// [commit: implemented user registration endpoint with validation + hashing]
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // [commit: check if user already exists by email]
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // [commit: enforce password length requirement]
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // [commit: hash password using bcrypt before saving]
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // [commit: create new user document in MongoDB]
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // [commit: return newly created user with JWT token]
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // [commit: handled server error case for registerUser]
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===================== LOGIN ===================== //
// [commit: implemented login with password verification]
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // [commit: find user by email in DB]
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // [commit: verify password using bcrypt.compare]
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // [commit: return user details with token if login successful]
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // [commit: handled server error case for loginUser]
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===================== GET USER PROFILE ===================== //
// [commit: added getUserProfile endpoint (requires authentication)]
export const getUserProfile = async (req, res) => {
  try {
    // [commit: fetch user details excluding password field]
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // [commit: return user profile JSON response]
    res.status(200).json(user);
  } catch (error) {
    // [commit: handled server error case for getUserProfile]
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
