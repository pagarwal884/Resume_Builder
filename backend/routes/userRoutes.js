// Import express framework to create router
import express from "express";

// Import controller functions for handling user-related logic
import {
  getUserProfile,   // Controller to get logged-in user's profile
  loginUser,        // Controller to handle login
  registerUser,     // Controller to handle registration
} from "../controllers/userController.js";

// Import authentication middleware to protect private routes
import { protect } from "../middleware/authMiddleware.js";

// Create a new router instance for user routes
const userRouter = express.Router();

// ---------------- ROUTES ----------------

// Route for registering a new user (POST request to /api/auth/register)
userRouter.post("/register", registerUser);

// Route for logging in an existing user (POST request to /api/auth/login)
userRouter.post("/login", loginUser);

// Protected route for getting user profile (GET request to /api/auth/profile)
// "protect" middleware will check JWT token before allowing access
userRouter.get("/profile", protect, getUserProfile);

// Export the router so it can be used in server.js (app.use("/api/auth", userRouter))
export default userRouter;
