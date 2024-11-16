import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null); // Store token in state
    const navigate = useNavigate();

    // Login function to store token in state and localStorage
    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        navigate('/homepage');
    };

    // Logout function to clear token
    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
        navigate('/auth/login');
    };

    // Check if the user is authenticated
    const isAuthenticated = () => !!authToken;

    // Load token from localStorage on app load
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

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
