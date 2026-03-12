const db = require('../config/db'); // Correct path

exports.createBooking = async (req, res) => {
    const {
        userId,
        hotelId,
        roomSelected,
        mealSelected,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        paymentMethod,
        status
    } = req.body;

    try {
        const guestName = req.body.guestName || "Guest";

        // Determine the booking status based on payment method
        // "pay_at_hotel" bookings are confirmed but payment is pending at hotel
        const bookingStatus = status || 'Confirmed';
        const payment = paymentMethod || 'credit_card';

        const query = `
            INSERT INTO bookings (
                u_id, 
                hotel_id, 
                guest_name, 
                room_selected, 
                meal_selected, 
                check_in, 
                check_out, 
                guests,
                total_price, 
                payment_method,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING b_id
        `;

        const values = [
            userId,
            hotelId,
            guestName,
            roomSelected,
            mealSelected,
            checkIn,
            checkOut,
            guests || 1,
            totalPrice,
            payment,
            bookingStatus
        ];

        const result = await db.query(query, values);

        res.status(201).json({
            message: 'Booking Successful',
            bookingId: result.rows[0].b_id
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};