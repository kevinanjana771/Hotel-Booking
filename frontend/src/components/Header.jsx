import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Check for the specific 'userName' key we set in Login.jsx
        const storedName = localStorage.getItem('userName');

        if (storedName) {
            // Set the user state so the UI (Welcome, {user.u_name}) works
            setUser({ u_name: storedName });
        } else {
            // 2. Fallback: check if there is a generic 'user' object
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const handleLogout = () => {
        // Clear all user-related data from storage
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        setUser(null);
        alert("Logged out successfully!");
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <i className="fa-solid fa-hotel"></i> BookingApp
                </Link>

                <nav className="nav-links">
                    <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
                    <Link to="/hotels">
                        <i className="fa-solid fa-location-dot"></i> Destinations
                    </Link>

                    {/* UPDATED: Single link to the unified Manager Dashboard */}
                    <Link to="/admin">
                        <i className="fa-solid fa-briefcase"></i> Manager Dashboard
                    </Link>

                    <Link to="/contact"><i className="fa-solid fa-envelope"></i> Contact</Link>
                </nav>

                <div className="auth-buttons">
                    {user ? (
                        <>
                            <span className="user-name">Welcome, {user.u_name}</span>
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn-register">Register</Link>
                            <Link to="/login" className="btn-signin">Sign in</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;