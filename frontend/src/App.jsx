import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DebtsPage from './pages/DebtsPage';
import Item from './pages/Item';
import ReportsPage from './pages/ReportsPage';
import { AuthProvider } from './context/AuthContext';

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

                </Routes>
            </Router>
        </AuthProvider>
        </div>
    );
};

export default App;
