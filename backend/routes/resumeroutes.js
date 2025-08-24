// Import required modules
import express from 'express'

// Import middleware to protect routes (only logged-in users can access)
import { protect } from '../middleware/authMiddleware.js'

// Import resume-related controller functions
import { 
  createResume,     // Create a new resume
  deleteResume,     // Delete a resume by ID
  getResumebyID,    // Fetch a specific resume by ID
  getUserResume,    // Fetch all resumes for the logged-in user
  updateResume      // Update a resume by ID
} from '../controllers/resumeController.js'

// Import controller for handling resume image uploads
import { uploadResumeImage } from '../controllers/uploadImg.js'

// Create an Express Router instance (used for grouping resume routes)
const resumeRouter = express.Router()

// ----------- ROUTES -----------

// Create a new resume
// Endpoint: POST /api/resume
// Middleware: protect (must be logged in)
// Controller: createResume
resumeRouter.post('/', protect, createResume)

// Get all resumes of the logged-in user
// Endpoint: GET /api/resume
resumeRouter.get('/', protect, getUserResume)

// Get a specific resume by ID
// Endpoint: GET /api/resume/:id
resumeRouter.get('/:id', protect, getResumebyID)

// Update a resume by ID
// Endpoint: PUT /api/resume/:id
resumeRouter.put('/:id', protect, updateResume)

// Upload images for a specific resume (extra route)
// Endpoint: PUT /api/resume/:id/upload-images
resumeRouter.put('/:id/upload-images', protect, uploadResumeImage)

// Delete a resume by ID
// Endpoint: DELETE /api/resume/:id
resumeRouter.delete('/:id', protect, deleteResume)

// Export the router so it can be used in server.js
export default resumeRouter
