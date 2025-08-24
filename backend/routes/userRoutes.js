// Import required modules
import express from "express";  
// Import controller functions that handle business logic for users
import {
  getUserProfile,   // Fetch user profile (only if logged in)
  loginUser,        // Authenticate user and return a token
  registerUser,     // Register a new user
} from "../controllers/userController.js";

// Import authentication middleware
import { protect } from "../middleware/authMiddleware.js";  
// `protect` checks if the request has a valid token before accessing certain routes

// Create an Express Router instance (separates routes into modules)
const userRouter = express.Router();

// ---------- ROUTES ----------

// Route to register a new user
// Endpoint: POST /api/auth/register
userRouter.post("/register", registerUser);

// Route to log in a user (generates and returns JWT token)
// Endpoint: POST /api/auth/login
userRouter.post("/login", loginUser);

// Protected route to get user profile
// Token is required -> `protect` middleware runs before `getUserProfile`
// Endpoint: GET /api/auth/profile
userRouter.get("/profile", protect, getUserProfile);

// Export router so it can be used in server.js
export default userRouter;
