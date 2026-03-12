const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

router.get('/hotels', managerController.getHotels);
router.post('/hotels', managerController.addHotel);
router.put('/pricing', managerController.updatePricing);
router.get('/bookings', managerController.getBookings);

module.exports = router;