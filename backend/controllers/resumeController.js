import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default template
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
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: "",
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      UserID: req.User._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed To create Resume", error: error.message });
  }
};

// Get Function
export const getUserResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ UserID: req.User._id }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resumes", error: error.message });
  }
};

// ================= GET RESUME BY ID =================
export const getResumebyID = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      UserID: req.User._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resume", error: error.message });
  }
};

// Update Resume
export const updateResume = async (res, req) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      UserID: req.User._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    // Merge Update Resume //
    Object.assign(resume, req.body);
    // Save Updated Resume //
    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    return res
      .status(500)
      .jwt({ message: "Failed to update Resume", error: error.message });
  }
};

// Delete Resume //
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      UserID: req.User._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    // Create A Upload Folder And Store The Resume There
    const uploadsFolder = path.join(process.cwd(), "uploads");

    // Delete thumbnail Function
    if (resume.thubnailLink) {
      const oldThumbnail = path.join(
        uploadsFolder,
        path.basename(resume.thubnailLink)
      );
      if(fs.existsSync(oldThumbnail)){
        fs.unlinkSync(oldThumbnail)
      }
    }

    if(resume.profileInfo.profilePreviewURL){
      const oldprofile = path.join(
        uploadsFolder ,
        path.basename(resume.profileInfo.profilePreviewURL),
      )
    }
  } catch (error) {}
};
