// backend/controllers/hotelDetailsController.js
const db = require('../config/db');

// Get Single Hotel Details
exports.getHotelDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Updated Query to match new DB Schema
        const query = `
            SELECT h.*, 
                   p.standard_price, 
                   p.deluxe_price, 
                   p.suite_price, 
                   p.breakfast_addon,        -- Renamed from bed_breakfast_addon
                   p.breakfast_lunch_addon,   -- New Column
                   p.full_board_addon         -- Existing column
            FROM hotels h
            LEFT JOIN hotel_pricing p ON h.h_id = p.hotel_id
            WHERE h.h_id = $1
        `;

        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Return the single hotel object
        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching hotel details:", error);
        res.status(500).json({ message: 'Server error' });
    }
};