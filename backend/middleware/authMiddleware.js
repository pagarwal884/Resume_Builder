import jwt from "jsonwebtoken";              // Import jsonwebtoken for verifying JWT tokens
import User from "../models/userModels.js";  // Import User model to fetch user details

// Protect middleware: verifies JWT token and authorizes user
export const protect = async (req, res, next) => {
  try {
    let token;  // Variable to store JWT token

    // Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1]; 

      // Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object (excluding password) to request
      req.user = await User.findById(decoded.id).select("-password");

      // If no user found with the decoded ID
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // If token and user are valid → allow request to proceed
      next();
    } else {
      // If no token present in header
      return res.status(401).json({ message: "Not authorized, no token found" });
    }
  } catch (error) {
    // Catch errors (invalid token, expired token, etc.)
    return res.status(401).json({
      message: "Token verification failed",
      error: error.message,
    });
  }
};
