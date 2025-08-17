// ================= IMPORTS =================
// Import Resume Mongoose Model (to interact with MongoDB collection "resumes")
import Resume from "../models/resumeModel.js";

// Import Node.js File System module (fs) to handle file deletion (unlinkSync, existsSync)
import fs from "fs";

// http request import is NOT used here, so we can safely remove it
// import { request } from "http";

// Import Node.js path module to safely construct file paths (platform independent)
import path from "path";


// ================= CREATE RESUME =================
export const createResume = async (req, res) => {
  try {
    const { title } = req.body; // Extract "title" from request body

    // Define a default resume template so every resume has a consistent structure
    const defaultResumeData = {
      profileInfo: {
        profileImg: null, // placeholder for profile image
        previewUrl: "",   // preview link for profile image
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        { company: "", role: "", startDate: "", endDate: "", description: "" },
      ],
      education: [
        { degree: "", institution: "", startDate: "", endDate: "" },
      ],
      skills: [{ name: "", progress: 0 }],
      projects: [{ title: "", description: "", github: "", liveDemo: "" }],
      certifications: [{ title: "", issuer: "", year: "" }],
      languages: [{ name: "", progress: "" }],
      interests: [""],
    };

    // Create new Resume document
    const newResume = await Resume.create({
      UserID: req.User._id,   // Store resume with logged-in user ID
      title,                  // User-provided title
      ...defaultResumeData,   // Default template
      ...req.body,            // Override defaults with user input if provided
    });

    res.status(201).json(newResume); // Respond with created resume
  } catch (error) {
    res.status(500).json({ message: "Failed To create Resume", error: error.message });
  }
};


// ================= GET ALL RESUMES OF USER =================
export const getUserResume = async (req, res) => {
  try {
    // Find all resumes where UserID matches logged-in user
    const resumes = await Resume.find({ UserID: req.User._id }).sort({ updatedAt: -1 }); // sort by latest
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
};


// ================= GET RESUME BY ID =================
export const getResumebyID = async (req, res) => {
  try {
    // Find resume by ID and ensure it belongs to logged-in user
    const resume = await Resume.findOne({ _id: req.params.id, UserID: req.User._id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume", error: error.message });
  }
};


// ================= UPDATE RESUME =================
export const updateResume = async (req, res) => {
  try {
    // Find resume by ID and ensure it belongs to user
    const resume = await Resume.findOne({ _id: req.params.id, UserID: req.User._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    // Merge request body into existing resume (Object.assign = shallow merge)
    Object.assign(resume, req.body);

    // Save updated resume to DB
    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update Resume", error: error.message });
  }
};


// ================= DELETE RESUME =================
export const deleteResume = async (req, res) => {
  try {
    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({ _id: req.params.id, UserID: req.User._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    // Define path to "uploads" folder where files are stored
    const uploadsFolder = path.join(process.cwd(), "uploads");

    // Delete thumbnail image if exists
    if (resume.thumbnailLink) {  // FIXED: spelling corrected
      const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail); // delete file
      }
    }

    // Delete profile preview image if exists
    if (resume.profileInfo.previewUrl) { // FIXED: matched key from createResume
      const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.previewUrl));
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile); // delete file
      }
    }

    // Delete resume document from DB
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, UserID: req.User._id });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    res.json({ message: "Resume deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to Delete Resume", error: error.message });
  }
};
