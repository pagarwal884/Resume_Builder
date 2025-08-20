import fs from "fs";                         // Node.js File System module (for checking/deleting files)
import path from "path";                     // Node.js Path module (for safely building file paths)
import Resume from "../models/resumeModel.js"; // Resume Mongoose model
import upload from "../middleware/UploadMiddleware.js"; // Multer middleware for file upload handling

// Controller function to upload or update resume images
export const uploadResumeImage = async (req, res) => {
  try {
    // Configure Multer to handle two possible file fields: thumbnail & profileImage
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
        // Handle Multer upload errors
        if (err) {
          return res.status(400).json({
            message: "File Upload failed",
            error: err.message,
          });
        }

        // Extract resume ID from route params
        const resumeID = req.params.id;

        // Find the resume belonging to the logged-in user
        const resumeDoc = await Resume.findOne({
          _id: resumeID,
          userID: req.user._id, // ensures only owner can update
        });

        // If no resume found or not authorized → return 404
        if (!resumeDoc) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }

        // Absolute path to uploads directory
        const uploadsFolder = path.join(process.cwd(), "uploads");

        // Construct base URL (example: http://localhost:5000)
        const baseurl = `${req.protocol}://${req.get("host")}`;

        // Extract uploaded files from Multer
        const newThumbnail = req.files.thumbnail?.[0];      // new thumbnail file (if provided)
        const newProfileImage = req.files.profileImage?.[0]; // new profile image file (if provided)

        // --------------------------
        // Handle Thumbnail Upload
        // --------------------------
        if (newThumbnail) {
          // If an old thumbnail exists, remove it from disk
          if (resumeDoc.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadsFolder,
              path.basename(resumeDoc.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) {
              fs.unlinkSync(oldThumbnail); // delete old file
            }
          }

          // Save new thumbnail link in DB
          resumeDoc.thumbnailLink = `${baseurl}/uploads/${newThumbnail.filename}`;
        }

        // --------------------------
        // Handle Profile Image Upload
        // --------------------------
        if (newProfileImage) {
          // Ensure profileInfo object exists
          if (!resumeDoc.profileInfo) {
            resumeDoc.profileInfo = {};
          }

          // If an old profile image exists, remove it
          if (resumeDoc.profileInfo.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadsFolder,
              path.basename(resumeDoc.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
              fs.unlinkSync(oldProfile); // delete old file
            }
          }

          // Save new profile preview URL
          resumeDoc.profileInfo.profilePreviewUrl = `${baseurl}/uploads/${newProfileImage.filename}`;
        }

        // Save updated resume document in MongoDB
        await resumeDoc.save();

        // Send success response with updated links
        res.status(200).json({
          message: "Image uploaded successfully",
          thumbnailLink: resumeDoc.thumbnailLink,
          profilePreviewUrl: resumeDoc.profileInfo?.profilePreviewUrl,
        });
      }
    );
  } catch (err) {
    // Catch unexpected errors
    console.error("Error Uploading Images:", err);
    res.status(500).json({
      message: "Failed to upload Images",
      error: err.message,
    });
  }
};
