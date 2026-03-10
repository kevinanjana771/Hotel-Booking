// backend/controllers/managerController.js
const db = require('../config/db');

// Get all hotels with their pricing
exports.getHotels = async (req, res) => {
    try {
        const query = `
            SELECT h.*, p.standard_price, p.deluxe_price, p.suite_price, 
                   p.breakfast_addon, p.breakfast_lunch_addon, p.full_board_addon
            FROM hotels h
            LEFT JOIN hotel_pricing p ON h.h_id = p.hotel_id
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching hotels' });
    }
};

// Add a new hotel and default pricing
exports.addHotel = async (req, res) => {
    const { name, location, basePrice, description } = req.body;
    try {
        // 1. Insert Hotel
        const hotelQuery = `
            INSERT INTO hotels (h_name, h_location, h_description, base_price) 
            VALUES ($1, $2, $3, $4) 
            RETURNING h_id
        `;
        const basePriceNum = Number(basePrice) || 0;
        const hotelResult = await db.query(hotelQuery, [name, location, description, basePriceNum]);
        const newHotelId = hotelResult.rows[0].h_id;

        // 2. Insert Default Pricing based on Base Price
        const pricingQuery = `
            INSERT INTO hotel_pricing (hotel_id, standard_price, deluxe_price, suite_price, breakfast_addon, breakfast_lunch_addon, full_board_addon)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        // Instead of calculating default numbers, just start these empty (null) so admin explicitly adds them
        await db.query(pricingQuery, [newHotelId, basePriceNum, null, null, null, null, null]);

        res.status(201).json({ message: 'Hotel added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding hotel' });
    }
};

// Update Pricing
exports.updatePricing = async (req, res) => {
    const { hotelId, standard, deluxe, suite, breakfast, breakfastLunch, fullBoard } = req.body;
    try {
        const query = `
            INSERT INTO hotel_pricing (
                standard_price, deluxe_price, suite_price, 
                breakfast_addon, breakfast_lunch_addon, full_board_addon, hotel_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (hotel_id) DO UPDATE SET 
                standard_price = EXCLUDED.standard_price, 
                deluxe_price = EXCLUDED.deluxe_price, 
                suite_price = EXCLUDED.suite_price, 
                breakfast_addon = EXCLUDED.breakfast_addon, 
                breakfast_lunch_addon = EXCLUDED.breakfast_lunch_addon, 
                full_board_addon = EXCLUDED.full_board_addon
        `;
        const parseNum = (val) => val === '' || val === null || val === undefined ? null : Number(val);
        await db.query(query, [
            parseNum(standard),
            parseNum(deluxe),
            parseNum(suite),
            parseNum(breakfast),
            parseNum(breakfastLunch),
            parseNum(fullBoard),
            parseNum(hotelId)
        ]);
        res.json({ message: 'Pricing updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating pricing' });
    }
};

// Get Bookings
exports.getBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.b_id, b.u_id, b.hotel_id, b.guest_name, 
                   b.room_selected, b.meal_selected,
                   b.check_in, b.check_out, b.guests,
                   b.total_price, b.payment_method, b.status,
                   b.created_at, h.h_name 
            FROM bookings b
            JOIN hotels h ON b.hotel_id = h.h_id
            ORDER BY b.created_at DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};