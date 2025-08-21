// ================= IMPORTS =================
// [commit: imported Resume model to interact with MongoDB resumes collection]
import Resume from "../models/resumeModel.js";

// [commit: imported fs module for file deletion handling]
import fs from "fs";

// [commit: imported path module for safe file path handling]
import path from "path";


// ================= CREATE RESUME =================
// [commit: implemented createResume endpoint with default resume template]
export const createResume = async (req, res) => {
  try {
    const { title, userId } = req.body;

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

    const newResume = await Resume.create({
      UserID: req.User?._id || userId, // ✅ safer assignment
      title,
      ...defaultResumeData,
      ...req.body,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: "Failed To create Resume", error: error.message });
  }
};


// ================= GET ALL RESUMES OF USER =================
// [commit: implemented getUserResume to fetch all resumes of logged-in user]
export const getUserResume = async (req, res) => {
  try {
    // [commit: fetch resumes by user ID and sort by last updated]
    const resumes = await Resume.find({ UserID: req.User._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
};


// ================= GET RESUME BY ID =================
// [commit: implemented getResumebyID with user authorization check]
export const getResumebyID = async (req, res) => {
  try {
    // [commit: fetch single resume by ID ensuring ownership]
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
// [commit: implemented updateResume with shallow merge of fields]
export const updateResume = async (req, res) => {
  try {
    // [commit: ensure resume exists and belongs to user]
    const resume = await Resume.findOne({ _id: req.params.id, UserID: req.User._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    // [commit: merge request body fields into existing resume object]
    Object.assign(resume, req.body);

    // [commit: save updated document to DB]
    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update Resume", error: error.message });
  }
};


// ================= DELETE RESUME =================
// [commit: implemented deleteResume with file cleanup for thumbnails/profile images]
export const deleteResume = async (req, res) => {
  try {
    // [commit: find resume by ID and user ownership]
    const resume = await Resume.findOne({ _id: req.params.id, UserID: req.User._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    // [commit: define uploads folder path]
    const uploadsFolder = path.join(process.cwd(), "uploads");

    // [commit: delete old thumbnail if exists]
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    // [commit: delete old profile preview image if exists]
    if (resume.profileInfo.previewUrl) {
      const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.previewUrl));
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // [commit: remove resume document from MongoDB]
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, UserID: req.User._id });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    res.json({ message: "Resume deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to Delete Resume", error: error.message });
  }
};
