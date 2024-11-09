import React, { createContext, useState, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null); // To store the JWT token

    // Function to log in and set the auth token
    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token); // Store token in localStorage for persistence
    };

    // Function to log out and clear the token
    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken'); // Remove token from localStorage
    };

    // Function to check if the user is authenticated
    const isAuthenticated = () => !!authToken;

    // Load token from localStorage on initial render if available
    React.useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authToken, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext in other components
export const useAuth = () => useContext(AuthContext);
    