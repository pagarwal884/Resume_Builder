import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";   
import upload from "../middleware/UploadMiddleware.js";

export const uploadResumeImage = async (req, res) => {
  try {
    // Configure Multer to handle both fields
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
        if (err) {
          return res.status(400).json({
            message: "File Upload failed",
            error: err.message,
          });
        }

        const resumeID = req.params.id;

        const resumeDoc = await Resume.findOne({
          _id: resumeID,
          userID: req.user._id,
        });

        if (!resumeDoc) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }

        // Path to uploads folder
        const uploadsFolder = path.join(process.cwd(), "uploads");
        const baseurl = `${req.protocol}://${req.get("host")}`;

        // ✅ Use correct field names (thumbnail, profileImage)
        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];

        if (newThumbnail) {
          if (resumeDoc.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadsFolder,
              path.basename(resumeDoc.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) {
              fs.unlinkSync(oldThumbnail);
            }
          }

          resumeDoc.thumbnailLink = `${baseurl}/uploads/${newThumbnail.filename}`;
        }

        if (newProfileImage) {
          if (!resumeDoc.profileInfo) {
            resumeDoc.profileInfo = {};
          }

          if (resumeDoc.profileInfo.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadsFolder,
              path.basename(resumeDoc.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
              fs.unlinkSync(oldProfile);
            }
          }

          resumeDoc.profileInfo.profilePreviewUrl = `${baseurl}/uploads/${newProfileImage.filename}`;
        }

        await resumeDoc.save();

        res.status(200).json({
          message: "Image uploaded successfully",
          thumbnailLink: resumeDoc.thumbnailLink,
          profilePreviewUrl: resumeDoc.profileInfo?.profilePreviewUrl,
        });
      }
    );
  } catch (err) {
    console.error("Error Uploading Images:", err);
    res.status(500).json({
      message: "Failed to upload Images",
      error: err.message,
    });
  }
};
