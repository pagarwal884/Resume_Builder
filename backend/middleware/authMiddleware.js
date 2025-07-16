import User from "../models/userModels.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token = req.header.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.User = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized , no Token Found" });
    }
  } catch (error) {
    res.status(401).json({
      message: "Token Failed",
      error: error.message,
    });
  }
};
