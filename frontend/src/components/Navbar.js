import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaLeaf, FaTruck } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Favicon and Logo */}
                <div className="navbar-link">
                    <Link to="/" className="navbar-link">
                        <FaHome className="navbar-icon" />
                        <h1>eMandi</h1>
                    </Link>
                </div>

                {/* Navbar Links with Icons */}
                <div className="navbar-links">
                    <Link to="/farmer" className="navbar-link">
                        <FaLeaf className="navbar-icon" />
                        Farmer
                    </Link>
                    <Link to="/buyer" className="navbar-link">
                        <FaUserAlt className="navbar-icon" />
                        Buyer
                    </Link>
                    <Link to="/logistics" className="navbar-link">
                        <FaTruck className="navbar-icon" />
                        Logistics
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
