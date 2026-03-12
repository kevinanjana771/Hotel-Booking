import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // --- State: Initialized as empty, populated by API ---
    const [hotels, setHotels] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for Adding Hotel
    const [newHotel, setNewHotel] = useState({ name: '', location: '', basePrice: '', description: '' });

    // --- UPDATED STATE FOR PRICING (3 Categories) ---
    const [pricingData, setPricingData] = useState({
        hotelId: '',
        standard: '',
        deluxe: '',
        suite: '',
        breakfast: '',       // New (was bb)
        breakfastLunch: '',  // New
        fullBoard: ''         // New (was fb)
    });

    // 1. Fetch Data on Mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [hotelsRes, bookingsRes] = await Promise.all([
                axios.get('/api/manager/hotels'),
                axios.get('/api/manager/bookings')
            ]);

            // MAP DATA: Updated to match new DB columns
            const mappedHotels = hotelsRes.data.map(h => ({
                id: h.h_id,
                name: h.h_name,
                location: h.h_location,
                basePrice: h.base_price,
                description: h.h_description,
                // Pricing nested data - UPDATED MAPPING
                pricing: {
                    standard: h.standard_price,
                    deluxe: h.deluxe_price,
                    suite: h.suite_price,
                    breakfast: h.breakfast_addon,       // New
                    breakfastLunch: h.breakfast_lunch_addon, // New
                    fullBoard: h.full_board_addon      // New
                }
            }));

            setHotels(mappedHotels);

            // Map Bookings
            const mappedBookings = bookingsRes.data.map(b => ({
                id: b.b_id,
                guest: b.guest_name,
                hotel: b.h_name,
                checkIn: b.check_in,
                checkOut: b.check_out,
                status: b.status,
                total: b.total_price,
                paymentMethod: b.payment_method || 'credit_card',
                room: b.room_selected || 'N/A',
                meal: b.meal_selected || 'None',
                guests: b.guests || 1
            }));

            setBookings(mappedBookings);

            // Initialize pricing form preserving currently selected hotel if it still exists
            if (mappedHotels.length > 0) {
                setPricingData(prev => {
                    const exists = mappedHotels.find(h => String(h.id) === String(prev.hotelId));
                    const selHotel = exists || mappedHotels[0];
                    return {
                        hotelId: selHotel.id,
                        standard: selHotel.pricing.standard || '',
                        deluxe: selHotel.pricing.deluxe || '',
                        suite: selHotel.pricing.suite || '',
                        breakfast: selHotel.pricing.breakfast || '',
                        breakfastLunch: selHotel.pricing.breakfastLunch || '',
                        fullBoard: selHotel.pricing.fullBoard || ''
                    };
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Handle Add Hotel
    const handleAddHotel = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/manager/hotels', {
                name: newHotel.name,
                location: newHotel.location,
                basePrice: newHotel.basePrice,
                description: newHotel.description
            });
            alert('Hotel Added Successfully!');
            setNewHotel({ name: '', location: '', basePrice: '', description: '' });
            fetchData(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('Error adding hotel');
        }
    };

    // 3. Handle Hotel Selection for Pricing (UPDATED LOGIC)
    const handleHotelSelect = (id, hotelsList = hotels) => {
        const hotel = hotelsList.find(h => String(h.id) === String(id));
        if (hotel && hotel.pricing) {
            setPricingData({
                hotelId: hotel.id,
                standard: hotel.pricing.standard || '',
                deluxe: hotel.pricing.deluxe || '',
                suite: hotel.pricing.suite || '',
                breakfast: hotel.pricing.breakfast || '',
                breakfastLunch: hotel.pricing.breakfastLunch || '',
                fullBoard: hotel.pricing.fullBoard || ''
            });
        }
    };

    // 4. Handle Save Pricing (UPDATED KEYS)
    const handleSavePricing = async () => {
        try {
            await axios.put('/api/manager/pricing', {
                hotelId: pricingData.hotelId,
                standard: pricingData.standard,
                deluxe: pricingData.deluxe,
                suite: pricingData.suite,
                // Sending the new keys
                breakfast: pricingData.breakfast,
                breakfastLunch: pricingData.breakfastLunch,
                fullBoard: pricingData.fullBoard
            });
            alert('Pricing Updated Successfully!');
            fetchData(); // Refresh data
        } catch (error) {
            console.error(error);
            alert('Error updating pricing');
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview bookings={bookings} />;
            case 'hotels': return <ManageHotels hotels={hotels} setHotels={setHotels} newHotel={newHotel} setNewHotel={setNewHotel} onAddHotel={handleAddHotel} />;
            case 'pricing': return <ManagePricing hotels={hotels} pricingData={pricingData} setPricingData={setPricingData} onSelectHotel={handleHotelSelect} onSave={handleSavePricing} />;
            case 'bookings': return <ManageBookings bookings={bookings} />;
            default: return <DashboardOverview bookings={bookings} />;
        }
    };

    return (
        <div className="manager-dashboard">
            <Header />
            <div className="manager-layout">
                <aside className="manager-sidebar">
                    <div className="user-profile">
                        <div className="avatar">M</div>
                        <div className="info"><h4>Manager</h4><p>Admin & Owner</p></div>
                    </div>
                    <nav className="manager-nav">
                        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <i className="fa-solid fa-gauge"></i> Dashboard
                        </button>
                        <button className={`nav-btn ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => setActiveTab('hotels')}>
                            <i className="fa-solid fa-hotel"></i> Manage Hotels
                        </button>
                        <button className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
                            <i className="fa-solid fa-tags"></i> Pricing & Packages
                        </button>
                        <button className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                            <i className="fa-solid fa-book"></i> Bookings
                        </button>
                    </nav>
                </aside>
                <main className="manager-content">{renderContent()}</main>
            </div>
        </div>
    );
};

// --- 1. Dashboard Overview ---
const DashboardOverview = ({ bookings }) => {
    const activeCount = bookings.filter(b => b.status === 'Confirmed').length;
    const payAtHotelCount = bookings.filter(b => b.paymentMethod === 'pay_at_hotel').length;
    const onlinePaidCount = bookings.filter(b => b.paymentMethod === 'credit_card').length;
    return (
        <>
            <h2>Dashboard Overview</h2>
            <div className="stats-container-large">
                <div className="stat-card-large">
                    <div className="icon-bg-large"><i className="fa-solid fa-calendar-check"></i></div>
                    <div className="stat-info-large">
                        <h3>{activeCount}</h3><p>Active Bookings</p>
                        <span className="stat-sub">{bookings.length} total</span>
                    </div>
                </div>
            </div>
            <div className="stats-row-small">
                <div className="mini-stat-card">
                    <div className="mini-stat-icon paid"><i className="fa-regular fa-credit-card"></i></div>
                    <div className="mini-stat-info">
                        <h4>{onlinePaidCount}</h4>
                        <p>Online Paid</p>
                    </div>
                </div>
                <div className="mini-stat-card">
                    <div className="mini-stat-icon hotel-pay"><i className="fa-solid fa-money-bill"></i></div>
                    <div className="mini-stat-info">
                        <h4>{payAtHotelCount}</h4>
                        <p>Pay at Hotel</p>
                    </div>
                </div>
            </div>
            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {bookings.slice(0, 5).map((b, i) => (
                        <div key={i} className="activity-item">
                            <div className={`activity-icon ${b.status === 'Confirmed' ? 'success' : 'warning'}`}>
                                <i className={`fa-solid ${b.status === 'Confirmed' ? 'fa-check' : 'fa-clock'}`}></i>
                            </div>
                            <div className="activity-details">
                                <h4>{b.status} Booking from {b.guest}</h4>
                                <p>{b.hotel} - Check-in: {b.checkIn}</p>
                            </div>
                            <span className={`payment-badge ${b.paymentMethod === 'pay_at_hotel' ? 'pay-hotel' : 'pay-online'}`}>
                                {b.paymentMethod === 'pay_at_hotel' ? '💵 Pay at Hotel' : '💳 Paid Online'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// --- 2. Manage Hotels ---
const ManageHotels = ({ hotels, newHotel, setNewHotel, onAddHotel }) => {
    return (
        <div className="full-width-section">
            <div className="section-header"><h2>Manage Hotels</h2></div>
            <div className="card modern-form-card">
                <h3><i className="fa-solid fa-plus-circle"></i> Add New Property</h3>
                <form onSubmit={onAddHotel} className="modern-form-grid">
                    <div className="form-group-modern">
                        <label>Hotel Name</label>
                        <input type="text" placeholder="e.g. Grand Plaza" required
                            value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} />
                    </div>
                    <div className="form-group-modern">
                        <label>Location</label>
                        <input type="text" placeholder="e.g. New York" required
                            value={newHotel.location} onChange={e => setNewHotel({ ...newHotel, location: e.target.value })} />
                    </div>
                    <div className="form-group-modern">
                        <label>Base Price (Rs.)</label>
                        <input type="number" placeholder="0.00" required
                            value={newHotel.basePrice} onChange={e => setNewHotel({ ...newHotel, basePrice: e.target.value })} />
                    </div>
                    <div className="form-group-modern full-width">
                        <label>Description</label>
                        <textarea placeholder="Short description about the hotel..." rows="2" required
                            value={newHotel.description} onChange={e => setNewHotel({ ...newHotel, description: e.target.value })}></textarea>
                    </div>
                    <button type="submit" className="btn-submit-modern"><i className="fa-solid fa-save"></i> Add Hotel</button>
                </form>
            </div>
            <div className="table-container">
                <h3>Your Properties</h3>
                <table className="manager-table">
                    <thead>
                        <tr>
                            <th>Name</th><th>Location</th><th>Base Price</th><th>Description</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map(h => (
                            <tr key={h.id}>
                                <td className="hotel-name-cell">{h.name}</td>
                                <td>{h.location}</td>
                                <td>Rs.{h.basePrice}</td>
                                <td>{h.description}</td>
                                <td>
                                    <button className="action-btn edit"><i className="fa-solid fa-pen"></i></button>
                                    <button className="action-btn delete"><i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 3. Pricing & Packages (UPDATED CATEGORIES) ---
const ManagePricing = ({ hotels, pricingData, setPricingData, onSelectHotel, onSave }) => {

    const handleSelectChange = (e) => {
        const id = e.target.value;
        onSelectHotel(id);
    };

    const handleInputChange = (field, value) => {
        setPricingData({ ...pricingData, [field]: value });
    };

    return (
        <div className="full-width-section">
            <div className="pricing-header-wrapper">
                <h2 className="mega-title">Pricing & Packages</h2>
                <p className="mega-subtitle">Manage room rates and meal plans for your properties.</p>
            </div>

            <div className="pricing-layout-new">
                {/* Left: Selection */}
                <div className="pricing-sidebar-card">
                    <div className="selector-label">Select Property</div>
                    <div className="custom-select-wrapper">
                        <i className="fa-solid fa-building"></i>
                        <select value={pricingData.hotelId} onChange={handleSelectChange}>
                            {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                    </div>
                    <div className="selector-info">
                        <p><strong>Location:</strong> {hotels.find(h => String(h.id) === String(pricingData.hotelId))?.location}</p>
                        <p><strong>Current Base:</strong> Rs.{hotels.find(h => String(h.id) === String(pricingData.hotelId))?.basePrice}</p>
                    </div>
                </div>

                {/* Right: Pricing Editor */}
                <div className="pricing-editor-area">
                    {/* Room Rates Section */}
                    <div className="pricing-block">
                        <h3><i className="fa-solid fa-bed"></i> Room Rates</h3>
                        <div className="price-inputs-grid-new">
                            <div className="price-card-input">
                                <label>Standard Room</label>
                                <div className="input-wrapper">
                                    <span className="currency">Rs.</span>
                                    <input type="number" value={pricingData.standard} onChange={e => handleInputChange('standard', e.target.value)} />
                                </div>
                            </div>
                            <div className="price-card-input">
                                <label>Deluxe / Duplex</label>
                                <div className="input-wrapper">
                                    <span className="currency">Rs.</span>
                                    <input type="number" value={pricingData.deluxe} onChange={e => handleInputChange('deluxe', e.target.value)} />
                                </div>
                            </div>
                            <div className="price-card-input">
                                <label>Executive Suite</label>
                                <div className="input-wrapper">
                                    <span className="currency">Rs.</span>
                                    <input type="number" value={pricingData.suite} onChange={e => handleInputChange('suite', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UPDATED: Meal Packages Section */}
                    <div className="pricing-block">
                        <h3><i className="fa-solid fa-utensils"></i> Meal Packages</h3>
                        <div className="price-inputs-grid-new">
                            {/* 1. Breakfast */}
                            <div className="price-card-input">
                                <label>Breakfast</label>
                                <div className="input-wrapper">
                                    <span className="currency">+Rs.</span>
                                    <input type="number" value={pricingData.breakfast} onChange={e => handleInputChange('breakfast', e.target.value)} />
                                </div>
                            </div>

                            {/* 2. Breakfast & Lunch */}
                            <div className="price-card-input">
                                <label>Breakfast & Lunch</label>
                                <div className="input-wrapper">
                                    <span className="currency">+Rs.</span>
                                    <input type="number" value={pricingData.breakfastLunch} onChange={e => handleInputChange('breakfastLunch', e.target.value)} />
                                </div>
                            </div>

                            {/* 3. Full Board */}
                            <div className="price-card-input">
                                <label>Full Board</label>
                                <div className="input-wrapper">
                                    <span className="currency">+Rs.</span>
                                    <input type="number" value={pricingData.fullBoard} onChange={e => handleInputChange('fullBoard', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pricing-actions">
                        <button onClick={onSave} className="btn-save-large"><i className="fa-solid fa-floppy-disk"></i> Save All Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Booking Confirmations ---
const ManageBookings = ({ bookings }) => {
    const [filter, setFilter] = useState('all');

    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'confirmed') return b.status === 'Confirmed';
        if (filter === 'pending') return b.status === 'Pending';
        if (filter === 'pay_at_hotel') return b.paymentMethod === 'pay_at_hotel';
        if (filter === 'credit_card') return b.paymentMethod === 'credit_card';
        return true;
    });

    return (
        <div className="full-width-section">
            <div className="section-header">
                <h2>Booking Confirmations</h2>
                <div className="booking-filters">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`} onClick={() => setFilter('confirmed')}>Confirmed</button>
                    <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
                    <button className={`filter-btn ${filter === 'pay_at_hotel' ? 'active' : ''}`} onClick={() => setFilter('pay_at_hotel')}>💵 Pay at Hotel</button>
                    <button className={`filter-btn ${filter === 'credit_card' ? 'active' : ''}`} onClick={() => setFilter('credit_card')}>💳 Paid Online</button>
                </div>
            </div>
            <div className="booking-grid">
                {filteredBookings.map(b => (
                    <div key={b.id} className={`booking-card ${b.paymentMethod === 'pay_at_hotel' ? 'pay-at-hotel-card' : ''}`}>
                        <div className="booking-card-header">
                            <div className="guest-info">
                                <div className="guest-avatar">{b.guest.charAt(0)}</div>
                                <div>
                                    <h4>{b.guest}</h4>
                                    <span className="booking-id">#{b.id}</span>
                                </div>
                            </div>
                            <div className="header-badges">
                                <span className={`payment-badge ${b.paymentMethod === 'pay_at_hotel' ? 'pay-hotel' : 'pay-online'}`}>
                                    {b.paymentMethod === 'pay_at_hotel' ? '💵 Pay at Hotel' : '💳 Paid Online'}
                                </span>
                                <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                            </div>
                        </div>
                        <div className="booking-card-body">
                            <div className="booking-detail-row">
                                <i className="fa-solid fa-hotel detail-icon"></i>
                                <div>
                                    <p className="label">Hotel</p>
                                    <p className="value">{b.hotel}</p>
                                </div>
                            </div>
                            <div className="booking-detail-row">
                                <i className="fa-solid fa-bed detail-icon"></i>
                                <div>
                                    <p className="label">Room Type</p>
                                    <p className="value">{b.room}</p>
                                </div>
                            </div>
                            <div className="booking-detail-row">
                                <i className="fa-solid fa-utensils detail-icon"></i>
                                <div>
                                    <p className="label">Meal Plan</p>
                                    <p className="value">{b.meal}</p>
                                </div>
                            </div>
                            <div className="booking-detail-row">
                                <i className="fa-solid fa-users detail-icon"></i>
                                <div>
                                    <p className="label">Guests</p>
                                    <p className="value">{b.guests} guest(s)</p>
                                </div>
                            </div>
                            <div className="booking-detail-row">
                                <i className="fa-regular fa-calendar-days detail-icon"></i>
                                <div>
                                    <p className="label">Duration</p>
                                    <p className="value">{b.checkIn} <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '0.8em', margin: '0 5px' }}></i> {b.checkOut}</p>
                                </div>
                            </div>
                        </div>
                        <div className="booking-card-footer">
                            <div className="total-price">
                                <span className="price-label">{b.paymentMethod === 'pay_at_hotel' ? 'Amount Due' : 'Total Paid'}</span>
                                <span className="price-value">Rs.{b.total}</span>
                            </div>
                            <button className="btn-view-booking">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerDashboard;