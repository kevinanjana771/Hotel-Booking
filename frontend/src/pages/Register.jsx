import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    // State keys now match database column names
    const [formData, setFormData] = useState({
        u_name: "",
        u_email: "",
        u_pass_word: "",
        confirmPassword: "",
    });

    const [isShaking, setIsShaking] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check password match
        if (formData.u_pass_word !== formData.confirmPassword) {
            setIsShaking(true);
            alert("Passwords do not match!");
            setTimeout(() => setIsShaking(false), 500);
            return;
        }

        // Prepare data object matching backend expectations
        const userData = {
            u_name: formData.u_name,
            u_email: formData.u_email,
            u_pass_word: formData.u_pass_word,
        };

        try {
            const response = await axios.post(
                "http://localhost:5001/api/auth/register",
                userData
            );

            console.log(response.data);
            alert("Registration Successful! Please Login.");
            navigate("/login");
        } catch (error) {
            console.error("Registration Error:", error);
            setIsShaking(true);

            const errorMessage =
                error.response?.data?.message || "Registration failed. Try again.";

            alert(errorMessage);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className={`register-card ${isShaking ? "shake" : ""}`}>
                    <div className="register-header">
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">
                            Join us and discover your next adventure
                        </p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="u_name"
                                placeholder=" "
                                value={formData.u_name}
                                onChange={handleChange}
                                required
                            />
                            <label>Full Name</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="u_email"
                                placeholder=" "
                                value={formData.u_email}
                                onChange={handleChange}
                                required
                            />
                            <label>Email Address</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="u_pass_word"
                                placeholder=" "
                                value={formData.u_pass_word}
                                onChange={handleChange}
                                required
                            />
                            <label>Password</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder=" "
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <label>Confirm Password</label>
                        </div>

                        <button type="submit" className="btn-register">
                            Register
                        </button>
                    </form>

                    <div className="login-link">
                        <p>
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;