import fs from "fs";                         // Node.js File System module (for checking/deleting files)
import path from "path";                     // Node.js Path module (for safely building file paths)
import Resume from "../models/resumeModel.js"; // Resume Mongoose model (stores resume info in MongoDB)
import upload from "../middleware/UploadMiddleware.js"; // Multer middleware for handling file uploads

// Controller function to upload or update resume images (thumbnail & profile image)
export const uploadResumeImage = async (req, res) => {
  try {
    // Configure Multer to accept two file fields: "thumbnail" and "profileImage"
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
        // Handle Multer-related errors (like invalid file type, size limits, etc.)
        if (err) {
          return res.status(400).json({
            message: "File Upload failed",
            error: err.message,
          });
        }

        // Get resume ID from route parameters (/resume/:id)
        const resumeID = req.params.id;

        // Find the resume in DB for the logged-in user only (authorization check)
        const resumeDoc = await Resume.findOne({
          _id: resumeID,
          userID: req.user._id, // ensures only the resume owner can update it
        });

        // If resume not found or user is unauthorized → return error
        if (!resumeDoc) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }

        // Get absolute path to the "uploads" folder (where Multer stores files)
        const uploadsFolder = path.join(process.cwd(), "uploads");

        // Construct base URL (example: http://localhost:5000) for serving files
        const baseurl = `${req.protocol}://${req.get("host")}`;

        // Extract uploaded files (if provided)
        const newThumbnail = req.files.thumbnail?.[0];      // new thumbnail file
        const newProfileImage = req.files.profileImage?.[0]; // new profile image file

        // --------------------------
        // Handle Thumbnail Upload
        // --------------------------
        if (newThumbnail) {
          // If an old thumbnail exists → delete it from disk
          if (resumeDoc.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadsFolder,
              path.basename(resumeDoc.thumbnailLink) // get filename from old link
            );
            if (fs.existsSync(oldThumbnail)) {
              fs.unlinkSync(oldThumbnail); // delete old thumbnail file
            }
          }

          // Save new thumbnail link in the resume document
          resumeDoc.thumbnailLink = `${baseurl}/uploads/${newThumbnail.filename}`;
        }

        // --------------------------
        // Handle Profile Image Upload
        // --------------------------
        if (newProfileImage) {
          // Ensure profileInfo object exists (to store profile image URL)
          if (!resumeDoc.profileInfo) {
            resumeDoc.profileInfo = {};
          }

          // If an old profile image exists → delete it from disk
          if (resumeDoc.profileInfo.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadsFolder,
              path.basename(resumeDoc.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
              fs.unlinkSync(oldProfile); // delete old profile image file
            }
          }

          // Save new profile image link in the resume document
          resumeDoc.profileInfo.profilePreviewUrl = `${baseurl}/uploads/${newProfileImage.filename}`;
        }

        // Save updated resume document in MongoDB
        await resumeDoc.save();

        // Respond with success and return updated file links
        res.status(200).json({
          message: "Image uploaded successfully",
          thumbnailLink: resumeDoc.thumbnailLink,
          profilePreviewUrl: resumeDoc.profileInfo?.profilePreviewUrl,
        });
      }
    );
  } catch (err) {
    // Handle unexpected server errors
    console.error("Error Uploading Images:", err);
    res.status(500).json({
      message: "Failed to upload Images",
      error: err.message,
    });
  }
};
