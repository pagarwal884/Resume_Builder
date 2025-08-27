import axios from 'axios'
import { BASE_URL } from './apiPath'

// Create an axios instance with default settings
const axioinstance = axios.create({
    baseURL: BASE_URL,                  // Base URL for all API requests
    timeout: 10000,                     // Request timeout (10 seconds)
    headers: {
        "Content-Type" : "application/json",  // Default request type
        Accept: "application/json",           // Accept JSON response
    } 
})

// ========================
// REQUEST INTERCEPTOR
// ========================
axioinstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage (if available)
        const accessToken = localStorage.getItem('token')
        
        // If token exists, add it to Authorization header
        if(accessToken){
            config.headers.Authorization =  `Bearer ${accessToken}`
        }
        return config; // Return modified config
    },
    (error) => {
        // Handle any request errors before sending
        return Promise.reject(error)
    }
)

// ========================
// RESPONSE INTERCEPTOR
// ========================
axioinstance.interceptors.response.use(
    (response) => {
        // Simply return the response if successful
        return response;
    },
    (error) => {
        // If server responded with an error
        if(error.response){
            // Unauthorized (token expired/invalid) → redirect to homepage/login
            if(error.response.status === 401){
                window.location.href = '/'
            }
            // Internal server error
            else if(error.response.status === 500){
                console.error("Server Error")
            }
        }
        // If no response but timeout happened
        else if(error.code === 'ECONNABORTED'){
            console.error("Request Timeout")
        }
        // Pass the error to be handled later
        return Promise.reject(error)
    }
)

export default axioinstance;   // Export axios instance for use across project
