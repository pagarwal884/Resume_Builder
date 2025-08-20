import User from "../models/userModels.js";
import jwt from "jsonwebtoken";

// ===================== PROTECT MIDDLEWARE ===================== //
// This middleware protects private routes by verifying JWT tokens
export const protect = async (req, res, next) => {
  try {
    // 🔹 Extract token from request headers
    // NOTE: should be "req.headers.authorization" instead of "req.header.authorization"
    let token = req.headers.authorization;

    // 🔹 Check if token exists and starts with "Bearer"
    if (token && token.startsWith("Bearer")) {
      // Remove "Bearer " from token string
      token = token.split(" ")[1];

      // 🔹 Verify token with JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔹 Fetch user by decoded ID and exclude password field
      req.user = await User.findById(decoded.id).select("-password");

      // 🔹 Pass control to next middleware/route
      next();
    } else {
      // No token provided
      res.status(401).json({ message: "Not authorized, no token found" });
    }
  } catch (error) {
    // 🔹 Handle invalid/expired token
    res.status(401).json({
      message: "Token verification failed",
      error: error.message,
    });
  }
};
