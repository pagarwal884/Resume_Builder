// Importing required modules
import express from "express";              // Express framework for building APIs
import cors from "cors";                    // Middleware to enable Cross-Origin Resource Sharing
import "dotenv/config";                     // Loads environment variables from a .env file
import { connectDB } from "./config/db.js"; // Custom function to connect to MongoDB
import userRoutes from "./routes/userRoutes.js";   // User-related routes (auth, login, register, etc.)
import resumeRouter from "./routes/resumeRoutes.js"; // Resume-related routes (upload, manage resumes, etc.)
import path from "path";                    // Node.js module for handling file paths
import { fileURLToPath } from "url";        // Utility to convert `import.meta.url` into a file path

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url); // Get the absolute file path of this file
const __dirname = path.dirname(__filename);        // Extract directory name from the file path

// Initialize express app and define port
const app = express();                                 // Create an Express application
const PORT = process.env.PORT || 4000;                 // Define the port (from .env or default 4000)

// ----------- MIDDLEWARE ------------
app.use(cors());                                       // Enable CORS (cross-origin requests allowed)
app.use(express.json());                               // Parse incoming JSON request bodies

// ----------- CONNECT DATABASE ------------
connectDB();                                           // Establish connection to MongoDB

// ----------- ROUTES ------------
app.use("/api/auth", userRoutes);                      // Routes for user authentication and management
app.use("/api/resume", resumeRouter);                  // Routes for resume-related operations

// Serve uploaded files statically
app.use(
  "/uploads",                                          // Files accessible via /uploads URL
  express.static(path.join(__dirname, "uploads"), {    // Serve files from 'uploads' directory
    setHeaders: (res, _path) => {                      // Set custom headers for file responses
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); 
      // Allow access only from frontend running on port 5173 (Vite default)
    },
  })
);

// ----------- ROOT ROUTE ------------
app.get("/", (req, res) => {                           // Basic route to check API status
  res.send("API WORKING");                             // Sends simple text response
});

// ----------- START SERVER ------------
app.listen(PORT, () => {                               // Start the server on the given port
  console.log(`Server Started on http://localhost:${PORT}`); // Log server URL in console
});
