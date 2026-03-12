import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {



    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isShaking, setIsShaking] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!formData.email || !formData.password) {
            setIsShaking(true);
            alert("Please enter both email and password.");
            setTimeout(() => setIsShaking(false), 500);
            return;
        }

        try {

            // Send data matching PostgreSQL columns
            const response = await axios.post(
                '/api/auth/login',
                {
                    u_email: formData.email,
                    u_pass_word: formData.password
                }
            );

            console.log("Login Data:", response.data);

            // Store user data in localStorage
            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));

            // Explicitly store individual items because other pages (like HotelDetails) check these
            if (userData) {
                localStorage.setItem('userId', userData.u_id || userData.id);
                localStorage.setItem('userName', userData.u_name || userData.name);
                localStorage.setItem('userEmail', userData.u_email || userData.email);
                localStorage.setItem('userRole', userData.u_role || 'customer');
            }

            alert("Login Successful!");
            
            // Forces a full page reload so the Header component updates correctly
            window.location.href = '/';


        } catch (error) {

            console.error("Login Error:", error);

            setIsShaking(true);

            const errorMessage =
                error.response?.data?.message ||
                "Login failed. Please try again.";

            alert(errorMessage);

            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (

        <div className="login-page">

            <div className="login-container">

                <div className={`login-card ${isShaking ? 'shake' : ''}`}>

                    <div className="login-header">
                        <h1 className="login-title">Sign In</h1>
                        <p className="login-subtitle">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <input
                                type="email"
                                name="email"
                                placeholder=" "
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <label>Email Address</label>

                        </div>

                        <div className="form-group">

                            <input
                                type="password"
                                name="password"
                                placeholder=" "
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <label>Password</label>

                        </div>

                        <button type="submit" className="btn-login">
                            Sign In
                        </button>

                    </form>

                    <div className="register-link">
                        <p>
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>

                </div>

            </div>

        </div>

    );
};

export default Login;