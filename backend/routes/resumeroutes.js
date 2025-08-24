import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createResume, deleteResume, getResumebyID, getUserResume, updateResume } from '../controllers/resumeController.js'

import { uploadResumeImage }  from '../controllers/uploadImg.js'

const resumeRouter = express.Router()

resumeRouter.post('/', protect, createResume)
resumeRouter.get('/', protect, getUserResume)
resumeRouter.get('/:id', protect, getResumebyID)
resumeRouter.put('/:id', protect, updateResume)
resumeRouter.put('/:id/upload-images', protect, uploadResumeImage)

resumeRouter.delete('/:id', protect, deleteResume)

export default resumeRouter
