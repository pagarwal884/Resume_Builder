import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnailString: {
      type: String,
    },
    template: {
      theme: String,
      colorPallete: [String],
    },

    profileInfo: {
      profilePreviewURL: String,
      fullName: String,
      designation: String,
      summery: String,
    },
    //   Work Experience
    workExp: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
      },
    ],
    skills: [
      {
        name: String,
        progress: Number,
      },
    ],
    Projects: [
      {
        title: String,
        description: String,
        github: String,
        liveDemo: String,
      },
    ],
    certification: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],
    languages: [
      {
        name: String,
        progress: Number,
      },
    ],
    interests: [String],
  },
  {
    timestamps: { cretaedAT: "createAT", updatedAt: "updatedAT" },
  }
);

export default mongoose.model("Resume", resumeSchema);
