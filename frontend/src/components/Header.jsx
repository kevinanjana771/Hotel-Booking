import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        // 1. Check for the specific 'userName' key we set in Login.jsx
        const storedName = localStorage.getItem('userName');
        const storedRole = localStorage.getItem('userRole');
        
        if (storedName) {
            // Set the user state so the UI (Welcome, {user.u_name}) works
            setUser({ u_name: storedName, u_role: storedRole });
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
        localStorage.removeItem('userRole');

        setUser(null);
        alert("Logged out successfully!");
        window.location.href = '/login';
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

                    {/* Show only for admin */}
                    {user && user.u_role === 'admin' && (
                        <Link to="/admin">
                            <i className="fa-solid fa-briefcase"></i> Admin Dashboard
                        </Link>
                    )}

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