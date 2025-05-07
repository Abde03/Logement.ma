import { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(null);
    
    return (
        <SearchContext.Provider value={{ search, setSearch, filter, setFilter }}>
        {children}
        </SearchContext.Provider>
    );

};