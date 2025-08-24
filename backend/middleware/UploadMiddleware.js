import multer from 'multer'      // Importing multer for handling file uploads

// Configure multer storage (where and how files will be saved)
const storage = multer.diskStorage({
    // Destination: folder where uploaded files will be stored
    destination: (req, file, cb) => {
        cb(null, "uploads/")  // Save all files inside "uploads" directory
    },
    // Filename: how the uploaded file will be named
    filename: (req, file, cb) => {
        // File will be saved with a timestamp + original name
        cb(null , `${Date.now()} - ${file.originalname}`)
    }
})

// FILE FILTER to restrict upload types (only images allowed)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png" , "image/jpg"];  // Allowed image formats
    if(allowedTypes.includes(file.mimetype)){   // If file type is valid
        cb(null, true)   // Accept the file
    }
    else{
        // Reject file with error message if type is not allowed
        cb(new Error("Only .jpeg, .jpg or .png are allowed format"), false)
    }
}

// Create multer instance with defined storage and filter
const upload = multer({ storage, fileFilter})

// Export upload middleware to use in routes (for uploading images)
export default upload;
