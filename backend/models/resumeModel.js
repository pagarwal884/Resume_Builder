// Import mongoose library to define schema and interact with MongoDB
import mongoose from "mongoose";

// Define schema for the Resume collection
const resumeSchema = new mongoose.Schema(
  {
    // Reference to the user who owns the resume
    UserID: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: "User",                          // Refers to the "User" model
      required: true,                       // Each resume must belong to a user
    },

    // Resume title (e.g., "Software Engineer Resume")
    title: {
      type: String,
      required: true,                       // Title is mandatory
    },

    // Optional thumbnail image stored as a string (e.g., Base64 or URL)
    thumbnailString: {
      type: String,
    },

    // Template customization info
    template: {
      theme: String,                        // Template theme name
      colorPallete: [String],               // Array of colors for customization
    },

    // Profile section details
    profileInfo: {
      profilePreviewURL: String,            // Image/Avatar preview URL
      fullName: String,                     // Full name of the user
      designation: String,                  // Job title/designation
      summery: String,                      // Short professional summary
    },

    // Work Experience section (can have multiple jobs)
    workExp: [
      {
        company: String,                    // Company name
        role: String,                       // Role/position
        startDate: String,                  // Job start date
        endDate: String,                    // Job end date
        description: String,                 // Job description
      },
    ],

    // Education section (can have multiple entries)
    education: [
      {
        degree: String,                     // Degree name
        institution: String,                 // Institution name
        startDate: String,                   // Start date
        endDate: String,                     // End date
      },
    ],

    // Skills section (with progress levels)
    skills: [
      {
        name: String,                       // Skill name
        progress: Number,                   // Proficiency (e.g., percentage)
      },
    ],

    // Projects section
    Projects: [
      {
        title: String,                      // Project title
        description: String,                 // Brief description
        github: String,                      // GitHub repository link
        liveDemo: String,                    // Live demo link
      },
    ],

    // Certifications section
    certification: [
      {
        title: String,                      // Certification name
        issuer: String,                     // Issuing authority
        year: String,                       // Year of certification
      },
    ],

    // Languages section (with proficiency levels)
    languages: [
      {
        name: String,                       // Language name
        progress: Number,                   // Proficiency (e.g., percentage)
      },
    ],

    // Interests section (simple string array)
    interests: [String],
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }

  }
);

// Export the Resume model
// "Resume" will be the collection name (pluralized as "resumes")
export default mongoose.model("Resume", resumeSchema);
