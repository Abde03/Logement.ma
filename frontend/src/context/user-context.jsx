import { useState, createContext, useEffect } from "react";
import axios from "axios";


// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    
    // Function to get auth-state from the server
    const getAuthState = async () => {
        try{
            const {data} = await axios.post("/auth/is-authenticated")
            if(data.success){
                setIsLoggedIn(true)
                getUser()
            }else{
                setIsLoggedIn(false)
            }
        }catch(error) {
            console.log(error.message)    
        }
    }


    // Function to get user data from the server
    const getUser = async () => {
        try{
            const {data} = await axios.get("/user/data")
            if(data.success){
                setUser(data.data.user)
                setIsLoggedIn(true)
            }
            else {
                setUser(null)
                setIsLoggedIn(false)
            }
        }catch (error) {
            console.log(error.response?.data?.message || error.message)
            setUser(null)
            setIsLoggedIn(false)
        }
    }

    // useEffect to check if user is logged in on component mount
    useEffect(() => {
        getAuthState()
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, getUser, getAuthState }}>
            {children}
        </UserContext.Provider>
    );
}
