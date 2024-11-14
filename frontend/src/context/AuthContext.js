import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null); // To store the JWT token
    const navigate = useNavigate();
    // Function to log in and set the auth token
    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token); // Store token in localStorage for persistence
        navigate('/homepage')
    };

    // Function to log out and clear the token
    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken'); // Remove token from localStorage
        navigate('/auth/login')
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
