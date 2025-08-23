import React, { Children, createContext, useEffect, useState } from "react";
import axioinstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPath";

export const UserContext = createContext();

const userProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) return

        const accessToken = localStorage.getItem('token')
        if(!accessToken){
            setLoading(false)
            return;
        }
        const fetchUser = async() => {
            try {
                const response = await axioinstance.get(API_PATHS,PATHS.AUTH.GET_PROFILE)
                setUser(response.data)
            } catch (error) {
                console.error("User not authenticated",error)
                clearUser()
            }
            finally{
                setLoading(false)
            }
        }
    })
}