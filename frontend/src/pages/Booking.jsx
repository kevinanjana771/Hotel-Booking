import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hotelId } = useParams();

    const { hotelName, roomType } = location.state || {};

    // Form State
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        selectedRoom: roomType || 'Standard',
        selectedMeal: 'None'
    });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('credit_card'); // 'credit_card' or 'pay_at_hotel'
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvv: ''
    });

    const [hotelPricing, setHotelPricing] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [nights, setNights] = useState(1);
    const [fetchError, setFetchError] = useState(false);

    // Fetch Hotel Details
    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!hotelId) return;
            try {
                const res = await axios.get(`/api/manager/hotels/${hotelId}`);
                if (res.data) {
                    setHotelPricing(res.data);
                } else {
                    setFetchError(true);
                }
            } catch (error) {
                console.error("Error fetching hotel for booking:", error);
                setFetchError(true);
            }
        };
        fetchHotelDetails();
    }, [hotelId]);

    // Calculate Total Price
    useEffect(() => {
        if (!bookingData.checkIn || !bookingData.checkOut || !hotelPricing) return;

        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const finalNights = diffDays <= 0 ? 1 : diffDays;
        setNights(finalNights);

        // Room Cost
        let roomCost = 0;
        if (bookingData.selectedRoom === 'Standard') roomCost = Number(hotelPricing.standard_price) || 0;
        else if (bookingData.selectedRoom === 'Deluxe') roomCost = Number(hotelPricing.deluxe_price) || 0;
        else if (bookingData.selectedRoom === 'Suite') roomCost = Number(hotelPricing.suite_price) || 0;

        // Meal Cost
        let mealCost = 0;
        if (bookingData.selectedMeal === 'Breakfast') mealCost = Number(hotelPricing.breakfast_addon) || 0;
        else if (bookingData.selectedMeal === 'Breakfast & Lunch') mealCost = Number(hotelPricing.breakfast_lunch_addon) || 0;
        else if (bookingData.selectedMeal === 'Full Board') mealCost = Number(hotelPricing.full_board_addon) || 0;

        const total = ((roomCost + mealCost) * finalNights * bookingData.guests);
        setTotalPrice(total);

    }, [bookingData, hotelPricing]);

    const handleConfirm = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');

        if (!userId) {
            alert("Please login to confirm booking.");
            navigate('/login');
            return;
        }

        if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
            alert("Check-out date must be after Check-in date.");
            return;
        }

        // Validation for Credit Card
        if (paymentMethod === 'credit_card') {
            if (cardInfo.number.length < 10 || !cardInfo.expiry || !cardInfo.cvv) {
                alert("Please enter valid credit card details.");
                return;
            }
        }

        try {
            await axios.post('/api/bookings', {
                userId: userId,
                hotelId: hotelId,
                guestName: userName,
                roomSelected: bookingData.selectedRoom,
                mealSelected: bookingData.selectedMeal,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                guests: bookingData.guests,
                totalPrice: totalPrice,
                paymentMethod: paymentMethod, // Send payment method
                status: 'Confirmed' // Explicitly confirming the order type as requested
            });

            alert("Booking Confirmed!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Booking failed. Please try again.");
        }
    };

    if (!hotelId) {
        return (
            <div className="booking-page">
                <div className="booking-container-centered">
                    <h2>No Hotel Selected</h2>
                    <p>Please select a hotel to start your booking.</p>
                    <button onClick={() => navigate('/')} className="btn-back-home">Return to Home</button>
                </div>
            </div>
        );
    }

    if (fetchError) return <div className="error-msg">Error loading hotel details.</div>;
    if (!hotelPricing) return <div className="loading-msg">Loading Booking Details...</div>;

    return (
        <div className="booking-page">
            <div className="booking-container">

                {/* ATTRACTIVE CENTERED HEADER (Name Only) */}
                <div className="booking-header-card centered">
                    <div className="header-icon-circle">
                        <i className="fa-solid fa-hotel"></i>
                    </div>
                    <h2>{hotelName}</h2>
                    <p className="header-subtitle">Luxury Stay Experience</p>
                </div>

                <div className="booking-forms-large">
                    <h2>Confirm and pay</h2>

                    <section className="form-section">
                        <h3>Your trip</h3>
                        <div className="trip-details">
                            <div className="detail-row">
                                <span>Dates</span>
                                <span>{bookingData.checkIn} to {bookingData.checkOut} ({nights} nights)</span>
                            </div>
                            <div className="detail-row">
                                <span>Guests</span>
                                <span>{bookingData.guests} guests</span>
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h3>Your Selections</h3>
                        <div className="input-group">
                            <label>Select Room</label>
                            <select value={bookingData.selectedRoom} onChange={e => setBookingData({ ...bookingData, selectedRoom: e.target.value })}>
                                <option value="Standard">Standard Room - Rs.{hotelPricing.standard_price}</option>
                                <option value="Deluxe">Deluxe Room - Rs.{hotelPricing.deluxe_price}</option>
                                <option value="Suite">Executive Suite - Rs.{hotelPricing.suite_price}</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Meal Plan</label>
                            <select value={bookingData.selectedMeal} onChange={e => setBookingData({ ...bookingData, selectedMeal: e.target.value })}>
                                <option value="None">Stay Only (No meals)</option>
                                <option value="Breakfast">Breakfast (+Rs.{hotelPricing.breakfast_addon})</option>
                                <option value="Breakfast & Lunch">Breakfast & Lunch (+Rs.{hotelPricing.breakfast_lunch_addon})</option>
                                <option value="Full Board">Full Board (+Rs.{hotelPricing.full_board_addon})</option>
                            </select>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Check-in</label>
                                <input type="date" value={bookingData.checkIn} onChange={e => setBookingData({ ...bookingData, checkIn: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Check-out</label>
                                <input type="date" value={bookingData.checkOut} onChange={e => setBookingData({ ...bookingData, checkOut: e.target.value })} />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Number of Guests</label>
                            <input type="number" min="1" value={bookingData.guests} onChange={e => setBookingData({ ...bookingData, guests: e.target.value })} />
                        </div>
                    </section>

                    <section className="form-section">
                        <h3>Price details</h3>
                        <div className="price-row">
                            <span>Room & Meals x {nights} nights x {bookingData.guests} guests</span>
                            <span>Rs.{(totalPrice / bookingData.guests).toFixed(2)}</span>
                        </div>

                        {/* TOTAL DISPLAYED AT THE BOTTOM */}
                        <div className="price-row total">
                            <span>Total (LKR)</span>
                            <span>Rs.{totalPrice.toFixed(2)}</span>
                        </div>
                    </section>

                    <section className="form-section">
                        <h3>Pay with</h3>

                        {/* Payment Method Selector */}
                        <div className="payment-selector">
                            <div
                                className={`payment-option ${paymentMethod === 'credit_card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('credit_card')}
                            >
                                <div className="payment-icon"><i className="fa-regular fa-credit-card"></i></div>
                                <div className="payment-text">Credit Card</div>
                                {paymentMethod === 'credit_card' && <div className="check-mark"><i className="fa-solid fa-check-circle"></i></div>}
                            </div>

                            <div
                                className={`payment-option ${paymentMethod === 'pay_at_hotel' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('pay_at_hotel')}
                            >
                                <div className="payment-icon"><i className="fa-solid fa-money-bill"></i></div>
                                <div className="payment-text">Pay at Hotel</div>
                                {paymentMethod === 'pay_at_hotel' && <div className="check-mark"><i className="fa-solid fa-check-circle"></i></div>}
                            </div>
                        </div>

                        {/* Conditional Card Inputs */}
                        {paymentMethod === 'credit_card' && (
                            <div className="card-inputs-container">
                                <div className="input-group">
                                    <label>Card number</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        value={cardInfo.number}
                                        onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                                    />
                                </div>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Expiry date</label>
                                        <input
                                            type="text"
                                            placeholder="MM / YY"
                                            value={cardInfo.expiry}
                                            onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            value={cardInfo.cvv}
                                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'pay_at_hotel' && (
                            <div className="pay-at-hotel-notice">
                                <p><i className="fa-solid fa-circle-info"></i> You will pay the full amount of <strong>Rs.{totalPrice.toFixed(2)}</strong> directly at the hotel reception upon arrival.</p>
                            </div>
                        )}
                    </section>

                    <button className="btn-confirm-large" onClick={handleConfirm}>Confirm Booking</button>
                </div>

            </div>
        </div>
    );
};

export default Booking;