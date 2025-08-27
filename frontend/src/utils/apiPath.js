// Base URL of the backend server
export const BASE_URL = 'http://localhost:4000/'

// ROUTES USED FOR FRONTEND
export const API_PATHS = {
    AUTH : {
        REGISTER:'/api/auth/register',              // API endpoint for user registration
        LOGIN: '/api/auth/login',                   // API endpoint for user login
        GET_PROFILE: '/api/auth/profile',           // API endpoint to fetch user profile
    },
    RESUME:{
        CREATE : '/api/resume',                     // API endpoint to create a new resume
        GET_ALL : '/api/resume',                    // API endpoint to fetch all resumes
        GET_BY_ID: (id) => `/api/resume/${id}`,     // API endpoint to fetch resume by ID
        UPDATE : (id) => `/api/resume/${id}`,       // API endpoint to update resume by ID
        DELETE : (id) => `/api/resume/${id}`,       // API endpoint to delete resume by ID
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`, // API endpoint to upload images for a specific resume
    },
    image: {
        UPLOAD_IMAGES: (id) => `api/auth/upload-image` // API endpoint to upload general images (not tied to resume)
    }
}
