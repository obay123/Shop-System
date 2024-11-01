import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DebtsPage from './pages/DebtsPage';
import Item from './pages/Item';
import ReportsPage from './pages/ReportsPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/debts" element={<DebtsPage />} />
                <Route path="/items" element={<Item />} />
                <Route path="/reports" element={<ReportsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
