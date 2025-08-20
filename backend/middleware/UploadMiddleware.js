import { now } from 'mongoose'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null , `${Date, now()} - ${file.originalname}`)
    }
})

// FILE FILTER
const fileFilter = (req, file,cb) => {
    const allowedTypes = ["image/jpeg", "image/png" , "image/jpg"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new Error("Onlu .jpeg, .jpg or .png are allowed format"), false)
    }
}

const upload = multer({ storage, fileFilter})
export default upload;