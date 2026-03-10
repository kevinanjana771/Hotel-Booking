// backend/routes/hotelDetailsRoutes.js
const express = require('express');
const router = express.Router();
const hotelDetailsController = require('../controllers/hotelDetailsController');

// Define the route for getting a single hotel
// This matches the frontend call: /api/manager/hotels/:id
router.get('/hotels/:id', hotelDetailsController.getHotelDetails);

module.exports = router;