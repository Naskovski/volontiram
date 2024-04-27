import React, { useState, createContext } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [edit, setEdit] = useState(false);
    const [location, setLocation] = useState("Цела Македонија");
    const [userSkills, setUserSkills] = useState([]);


    const value={
        name, setName,
        edit, setEdit,
        location, setLocation,
        userSkills, setUserSkills,
    };
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
export { DataContext, DataProvider };