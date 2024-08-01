import axios from 'axios';
import React, {createContext, useState , useEffect} from 'react';

const UserContext = createContext({});

export function UserProvider({children}) {
    const {user, setUser} = useState(null);
    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(response => {
                setUser(response.data);
                console.log(response.data);
                console.log(user);
            });
        }
    }, []);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}