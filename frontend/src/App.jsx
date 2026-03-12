import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import ManagerDashboard from './pages/ManagerDashboard';
import './App.css';

// Wrapper for public pages that need the global Header and Footer
const PageLayout = () => {
    return (
        <div className="app-layout">
            <Header />
            <main className="main-content">
                <Outlet /> {/* Child routes will render here */}
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* PUBLIC ROUTES (Sharing one Header instance) */}
                <Route element={<PageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/hotels" element={<Hotels />} />
                    <Route path="/hotel/:id" element={<HotelDetails />} />
                    <Route path="/booking/:hotelId" element={<Booking />} />
                    <Route path="/about" element={
                        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                            <h1>About Us</h1>
                            <p>Welcome to BookingApp. We provide the best hotel booking experience.</p>
                        </div>
                    } />
                    <Route path="/contact" element={
                        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                            <h1>Contact Us</h1>
                            <p>Email: support@bookingapp.com</p>
                        </div>
                    } />
                </Route>

                {/* MANAGER DASHBOARD (Full Screen Layout) */}
                <Route path="/admin" element={<ManagerDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;