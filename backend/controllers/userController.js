import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// GENERATE A TOKEN JWT
const generateToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check User Is already Exist Or Not
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User Already Exist" });
    }
    if (password < 8) {
      return res.status(400).jsom({
        success: false,
        message: "Password must be of Atleast 8 Characters",
      });
    }
    // Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const user = User.create({
      name,
      email,
      password: hashedpassword,
    });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// LOGIN FUNCTION
export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Invalid Email or Password" });
    }

    // Compare the Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: "Invalid Email or Password" });
    }
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
