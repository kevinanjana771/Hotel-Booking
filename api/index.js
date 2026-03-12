// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Loads .env file FIRST before any imports that use env vars

// Database
const db = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const hotelDetailsRoutes = require('./routes/hotelDetailsRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/manager', hotelDetailsRoutes);
app.use('/api/bookings', bookingRoutes);

// Global error handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Start Server - verify DB connection first
const PORT = process.env.PORT || 5001;

// Export the app for Vercel
module.exports = app;

// Only listen if not running in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    db.query('SELECT 1')
        .then(() => {
            console.log('✅ Database connected successfully');
            app.listen(PORT, () => {
                console.log(`✅ Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('❌ Database connection failed:', err.message);
            console.log('⚠️  Starting server anyway (DB queries will fail)...');
            app.listen(PORT, () => {
                console.log(`⚠️ Server running on port ${PORT} (without DB)`);
            });
        });
}