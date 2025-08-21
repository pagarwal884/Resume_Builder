import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

// Protect middleware: verifies JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token

      // Verify token with secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token found" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Token verification failed",
      error: error.message,
    });
  }
};
