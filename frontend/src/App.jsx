import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DebtsPage from './pages/DebtsPage';
import Item from './pages/Item';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage'; 
import ProfilePage from './pages/ProfilePage'; 
import NotFoundPage from './pages/NotFoundPage'; 


const App = () => {
    return (
        <div style={{ direction: 'rtl' }}>
        <AuthProvider>
            <Router>    
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/debts" element={<DebtsPage />} />
                <Route path="/items" element={<Item />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Router>
        </AuthProvider>
        </div>
    );
};

export default App;
