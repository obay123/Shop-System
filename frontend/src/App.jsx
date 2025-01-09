import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DebtsPage from './pages/DebtsPage';
import ItemPage from './pages/ItemsPage';
import ReportsPage from './pages/ReportsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage.jsx';
import ReportForm from './pages/ReportForm'
import NotFoundPage from './pages/NotFoundPage.jsx';
import './App.css';

const App = () => {
    return (
        <div style={{ direction: 'rtl' }}>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/debts" element={<DebtsPage />} />
                    <Route path="/items" element={<ItemPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/reports/new" element={<ReportForm/>}/>
                    <Route path="/reports/:date" element={<ReportForm />} />
                    <Route path="*" element={<NotFoundPage />} /> 
                </Routes>
            </AuthProvider>
        </div>
    );
};

export default App;
