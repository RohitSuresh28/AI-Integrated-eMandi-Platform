import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Ensure you have styles for your navigation
import './src/pages/landingpage.css';
const Navigation = () => {
    return (
        <nav className="navigation">
            <ul>

            </ul>
            <div className="login-buttons-container">
                <Link to="/farmer/login">
                    <button className="btn primary">Farmer Login</button>
                </Link>
                <Link to="/buyer/login">
                    <button className="btn primary">Buyer Login</button>
                </Link>
                <Link to="/logistics/login">
                    <button className="btn primary">Logistics Login</button>
                </Link>
            </div>
        </nav >
    );
};

export default Navigation; 
