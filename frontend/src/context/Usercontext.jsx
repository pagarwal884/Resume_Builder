import React, { Children, createContext, useEffect, useState } from "react";

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
                const response = await ax
            } catch (error) {
                
            }
        }
    })
}