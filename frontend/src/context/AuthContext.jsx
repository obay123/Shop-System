import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData, token) => {
        console.log(userData)
        setUser(userData);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        // On component mount, check if a token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally decode or validate the token and fetch user data
            // Example: Decode token to get user data
            console.log(token)
            const userData = { username: 'ExampleUser' }; 
            setUser(userData);
        }
    }, []);

    const isAuthenticated = Boolean(localStorage.getItem('token')); 

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
