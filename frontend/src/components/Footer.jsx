import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>BookingApp</h3>
                    <p>The professional choice for your next holiday.</p>
                </div>
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Manage Your Bookings</a></li>
                        <li><a href="#">Contact Customer Support</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Discover</h4>
                    <ul>
                        <li><a href="#">Rewards & Loyalty Program</a></li>
                        <li><a href="#">Seasonal & Special Deals</a></li>
                        <li><a href="#">Travel Articles</a></li>
                    </ul>
                </div>
            </div>
            <div className="copyright">
                Copyright © 2023 BookingApp. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;