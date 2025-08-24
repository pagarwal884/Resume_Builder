// Import express framework to create the server and handle routes
import express from "express";

// Import CORS middleware (Cross-Origin Resource Sharing) to allow frontend (different domain/port) access
import cors from "cors";

// Import dotenv to load environment variables from a .env file
import "dotenv/config";

// Import MongoDB connection function from config folder
import { connectDB } from "./config/db.js";

// Import user-related routes (register, login, etc.)
import userRoutes from "./routes/userRoutes.js";       

// Import resume-related routes (CRUD operations on resumes)
import resumeRouter from "./routes/resumeRoutes.js";   

// Import path module to handle file and directory paths
import path from "path";

// Import fileURLToPath to convert ES module URL to file path
import { fileURLToPath } from "url";

// Get the current file name
const __filename = fileURLToPath(import.meta.url);

// Get the current directory name from file path
const __dirname = path.dirname(__filename);

// Create an Express application
const app = express();

// Set port from environment variables or default to 4000
const PORT = process.env.PORT || 4000;

// ---------------- MIDDLEWARE ----------------

// Enable CORS for all routes (allows cross-origin requests)
app.use(cors());

// Enable JSON body parsing in requests (so we can use req.body)
app.use(express.json());

// ---------------- DATABASE ----------------

// Connect to MongoDB database
connectDB();

// ---------------- ROUTES ----------------

// All authentication-related routes will start with /api/auth
app.use("/api/auth", userRoutes);

// All resume-related routes will start with /api/resume
app.use("/api/resume", resumeRouter);

// Serve static files (uploaded images/resumes) from /uploads directory
// Also set custom headers to allow frontend (http://localhost:5173) access
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);

// Default route to test if API is working
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start the server and listen on the defined PORT
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
