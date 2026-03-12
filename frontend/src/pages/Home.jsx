import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import HotelCard from '../components/HotelCard';

// --- 1. IMPORT ALL HOTEL IMAGES ---
import CinnamonGrand from '../images/hotel_img/Cinnamon Grand Colombo.jpg';
import ShangrilaColombo from '../images/hotel_img/Shangri-La Colombo.jpg';
import JetwingBlue from '../images/hotel_img/JetwingBlue.jpg';
import AmariGalle from '../images/hotel_img/AmariGalle.jpeg';

// --- 2. IMAGE MAPPING ---
const normalizeName = (name) => name ? name.replace(/[\s-]/g, '').toLowerCase() : '';

const hotelImages = {
  "cinnamongrandcolombo": CinnamonGrand,
  "shangrilacolombo": ShangrilaColombo,
  "jetwingblue": JetwingBlue,
  "amarigalle": AmariGalle,
};

const Home = () => {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);
    const [searchParams, setSearchParams] = useState({
        location: ''
    });

    const [featuredHotels, setFeaturedHotels] = useState([]);
    const [allHotels, setAllHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

    // Trigger animation on load
    useEffect(() => {
        setAnimate(true);
    }, []);

    useEffect(() => {
        const fetchFeaturedHotels = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5001/api/manager/hotels');

                // --- 3. LOGIC TO GET SPECIFIC 4 HOTELS ---
                const targetHotels = [
                    'Cinnamon Grand Colombo',
                    'Shangri-La Colombo',
                    'Jetwing Blue',
                    'Amari Galle'
                ];

                // Filter the response to only include the specific hotels requested
                const specificHotels = response.data.filter(h => targetHotels.includes(h.h_name));

                // Map them to the component props
                const mappedHotels = specificHotels.map(h => ({
                    id: h.h_id,
                    title: h.h_name,
                    location: h.h_location,
                    price: h.base_price,
                    rating: 4.8,
                    // Match the local image, fallback to CinnamonGrand if not found
                    image: hotelImages[normalizeName(h.h_name)] 
                }));

                // If for some reason the database doesn't have all 4, we take what we have (up to 4)
                setFeaturedHotels(mappedHotels.slice(0, 4));
                setAllHotels(mappedHotels);
            } catch (error) {
                console.error("Error fetching featured hotels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedHotels();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/hotels');
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchParams({ ...searchParams, location: value });
        
        // Show suggestions if input is not empty
        if (value.trim() !== '') {
            const filtered = allHotels.filter(h =>
                h.location.toLowerCase().includes(value.toLowerCase()) ||
                h.title.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchParams({ ...searchParams, location: suggestion.location });
        setSuggestions([]);
        navigate('/hotels');
    };

    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className={`hero-title ${animate ? 'animate-up' : ''}`}>
                        Find Your Home <span className="highlight">Away From Home</span>
                    </h1>
                    <p className={`hero-subtitle ${animate ? 'animate-up-delay' : ''}`}>
                        Discover amazing hotels and resorts at the best prices.
                    </p>
                </div>
            </section>

            {/* UPGRADED SEARCH BAR */}
            <section className="search-container">
                <form className="search-bar-upgraded" onSubmit={handleSearch}>
                    <div className="search-field-upgraded" style={{ position: 'relative', flex: 1 }}>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-location-dot"></i>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                value={searchParams.location}
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>
                        {suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <i className="fa-solid fa-map-pin"></i>
                                        <span>{suggestion.location}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="search-button-upgraded">
                        <i className="fa-solid fa-magnifying-glass"></i> Search
                    </button>
                </form>
            </section>

            {/* DESTINATIONS SECTION (Popular Hotels) */}
            <section className="destinations-section">
                <div className="section-header">
                    <h2>Popular Destinations</h2>
                    <p>Explore our most highly-rated hotel branches</p>
                </div>

                {loading ? (
                    <div className="loading-state" style={{ textAlign: 'center', padding: '50px' }}>
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p>Loading featured hotels...</p>
                    </div>
                ) : featuredHotels.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>No featured hotels at the moment.</p>
                    </div>
                ) : (
                    <div className="destinations-grid">
                        {featuredHotels.map(hotel => (
                            <HotelCard
                                key={hotel.id}
                                id={hotel.id}
                                title={hotel.title}
                                location={hotel.location}
                                rating={hotel.rating}
                                price={hotel.price}
                                image={hotel.image}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section className="features-section">
                <div className="section-header-center">
                    <h2>Why Choose Us</h2>
                    <p>The best booking experience guaranteed</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-circle"><i className="fa-solid fa-tags"></i></div>
                        <h3>Best Prices</h3>
                        <p>We guarantee the best prices on the market with our exclusive deals and price match promise.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-circle"><i className="fa-solid fa-headset"></i></div>
                        <h3>24/7 Support</h3>
                        <p>Our dedicated support team is available round the clock to assist you with any inquiries.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-circle"><i className="fa-solid fa-shield-halved"></i></div>
                        <h3>Secure Booking</h3>
                        <p>Your booking and payment information are completely secure with our advanced encryption.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;