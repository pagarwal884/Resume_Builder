// ================= IMPORTS =================
import Resume from "../models/resumeModel.js"; // Mongoose model for Resume schema
import fs from "fs"; // File system module (used to delete files)
import path from "path"; // Path module (for handling safe file paths)


// ================= CREATE RESUME =================
export const createResume = async (req, res) => {
  try {
    const { title, userId } = req.body; // Extract title and userId from request body

    // Default resume structure (pre-filled blank template for new users)
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
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
      education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
      skills: [{ name: "", progress: 0 }],
      projects: [{ title: "", description: "", github: "", liveDemo: "" }],
      certifications: [{ title: "", issuer: "", year: "" }],
      languages: [{ name: "", progress: "" }],
      interests: [""],
    };

    // Create a new resume in MongoDB
    const newResume = await Resume.create({
      UserID: req.User?._id || userId, // Prefer authenticated userId, fallback to passed one
      title,
      ...defaultResumeData, // Insert default fields
      ...req.body, // Overwrite defaults with user-provided fields
    });

    res.status(201).json(newResume); // Send back created resume
  } catch (error) {
    res.status(500).json({ message: "Failed To create Resume", error: error.message });
  }
};


// ================= GET ALL RESUMES OF USER =================
export const getUserResume = async (req, res) => {
  try {
    // Find all resumes belonging to the logged-in user, sorted by latest update
    const resumes = await Resume.find({ UserID: req.User._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
};


// ================= GET RESUME BY ID =================
export const getResumebyID = async (req, res) => {
  try {
    // Find resume by its ID, but only if it belongs to the logged-in user
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
    // Check if resume exists and belongs to logged-in user
    const resume = await Resume.findOne({ _id: req.params.id, UserID: req.User._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    // Merge incoming fields into the existing resume (shallow merge)
    Object.assign(resume, req.body);

    // Save updated resume
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

    // Define the folder where uploaded files are stored
    const uploadsFolder = path.join(process.cwd(), "uploads");

    // Delete stored thumbnail image if exists
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    // Delete stored profile image if exists
    if (resume.profileInfo.previewUrl) {
      const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.previewUrl));
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // Finally delete the resume document from MongoDB
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, UserID: req.User._id });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    res.json({ message: "Resume deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to Delete Resume", error: error.message });
  }
};
