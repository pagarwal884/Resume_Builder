import fs from 'fs'
import path from 'path'
import resume from '../models/resumeModel.js'
import upload from '../middleware/UploadMiddleware.js'
import { error } from 'console'

export const uploadResumeImage = async (req,res) => {
    try {
        // Configure Multer to handle images
        upload.fields([{name:"thumbnail"},{name:"profileImage"}])
        (req,res,async (err) => {
            if(err){
                return res.status(400).js({message:"File Upload failed", error: err.message})
            }

            const resumeID = req.params.id;
            const resume = await resume.findonr({_id: resumeID, userID: req.user._id})

            if(!resume){
                return res.status(404).js({message:"Resume not found or unauthorized"})
            }

            // Use Process CWD To Locate Upload Folder
            const uploadsFolder = path.join(process.cwd(), "uploads")
            const baseurl = `${req.protocol}://${req.get('host')}`; 

            const newThumbnail = req.files.newThumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            if(newThumbnail){
                if(resume.thumbnailLink){
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
                    if(fs.existsSync(oldThumbnail)){
                        fs.unlinkSync(oldThumbnail)
                    }

                    resume.thumbnailLink = `${baseurl}/uploads/${newThumbnail.filename}`;
                }
            }

            // Same for the Profile Preview Image
            if(newProfileImage){
                if(resume.profileInfo?.profilePreviewUrl){
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl))
                    if(fs.existsSync(oldProfile)){
                        fs.unlinkSync(oldProfile)
                    }

                    resume.profileInfo.profilePreviewUrl = `${baseurl}/uploads/${newProfileImage.filename}`;
                }
            }

            await resume.save();
            res.status(200).json({
                message: "Image Upload Successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
            })
        })
    } catch (err) {
        console.error('Error Uploading Images:',err)
        res.status(500).json({
            message: "Failed to upload Images",
            error: err.message,
        })
    }
}