import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/FarmerLogin';
import BuyerLogin from './pages/BuyerLogin';
import LogisticsLogin from './pages/LogisticsLogin';
import FarmerPage from './pages/FarmerPage';
import BuyerPage from './pages/BuyerPage';
import LogisticsPage from './pages/LogisticsPage';
import Navigation from './components/Navigation';

const App = () => {
    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/farmer/login" element={<FarmerLogin />} />
                    <Route path="/buyer/login" element={<BuyerLogin />} />
                    <Route path="/logistics/login" element={<LogisticsLogin />} />
                    <Route path="/farmer" element={<FarmerPage />} />
                    <Route path="/buyer" element={<BuyerPage />} />
                    <Route path="/logistics" element={<LogisticsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;