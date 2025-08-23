import axios from 'axios'
import { BASE_URL } from './apiPath'

const axioinstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
        Accept: "application/json",
    } 
})

// REQUEST INTERCEPTER
axioinstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if(accessToken){
            config.headers.Authorization =  `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

// RESPONSE INTERCCEPTORS
axioinstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 401){
                window.location.href = '/'
            }
            else if(error.response.status === 500){
                console.error("Server Error")
            }
        }
        else if(error.code === 'ECONNABORTED'){
            console.error("Request Timeout")
        }
        return Promise.reject(error)
    }
)

export default axioinstance;