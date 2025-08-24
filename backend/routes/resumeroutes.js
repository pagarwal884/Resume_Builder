// Import express framework to create router
import express from 'express'

// Import authentication middleware (protects routes with JWT verification)
import { protect } from '../middleware/authMiddleware.js'

// Import controller functions for resume operations
import { 
  createResume,     // Controller to create a new resume
  deleteResume,     // Controller to delete a resume
  getResumebyID,    // Controller to fetch a single resume by its ID
  getUserResume,    // Controller to fetch all resumes of the logged-in user
  updateResume      // Controller to update an existing resume
} from '../controllers/resumeController.js'

// Import controller function for uploading resume-related images
import { uploadResumeImage } from '../controllers/uploadImg.js'

// Create a new router instance for resume routes
const resumeRouter = express.Router()

// ---------------- RESUME ROUTES ----------------

// Route to create a new resume (POST request to /api/resume)
// Requires authentication via "protect"
resumeRouter.post('/', protect, createResume)

// Route to fetch all resumes of the logged-in user (GET request to /api/resume)
// Requires authentication via "protect"
resumeRouter.get('/', protect, getUserResume)

// Route to fetch a specific resume by ID (GET request to /api/resume/:id)
// Requires authentication via "protect"
resumeRouter.get('/:id', protect, getResumebyID)

// Route to update a specific resume by ID (PUT request to /api/resume/:id)
// Requires authentication via "protect"
resumeRouter.put('/:id', protect, updateResume)

// Route to upload images related to a specific resume (PUT request to /api/resume/:id/upload-images)
// Requires authentication via "protect"
resumeRouter.put('/:id/upload-images', protect, uploadResumeImage)

// Route to delete a specific resume by ID (DELETE request to /api/resume/:id)
// Requires authentication via "protect"
resumeRouter.delete('/:id', protect, deleteResume)

// Export the router so it can be used in server.js (app.use("/api/resume", resumeRouter))
export default resumeRouter
