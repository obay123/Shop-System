import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DebtsPage from './pages/DebtsPage';
import ItemPage from './pages/ItemsPage';
import ReportsPage from './pages/ReportsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ReportForm from './pages/ReportForm';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './PrivateRoute.jsx';
import './App.css';

const App = () => {
    return (
        <div style={{ direction: 'rtl' }}>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Private Routes */}
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/debts" 
                        element={
                            <PrivateRoute>
                                <DebtsPage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/items" 
                        element={
                            <PrivateRoute>
                                <ItemPage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/reports" 
                        element={
                            <PrivateRoute>
                                <ReportsPage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/reports/new" 
                        element={
                            <PrivateRoute>
                                <ReportForm />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/reports/:date" 
                        element={
                            <PrivateRoute>
                                <ReportForm />
                            </PrivateRoute>
                        } 
                    />

                    {/* Catch-all Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </div>
    );
};

export default App;
