import React, { useState, useEffect } from 'react';
// Import images
import CinnamonGrand from '../images/hotel_img/Cinnamon Grand Colombo.jpg';
import Shangrila from '../images/hotel_img/Shangri-La Colombo.jpg';
import GalleFace from '../images/hotel_img/GalleFace.jpeg';
import Kingsbury from '../images/hotel_img/Kingsbury.jpg';
import CinnamonRed from '../images/hotel_img/CinnamonRed.jpg';
import Kandalama from '../images/hotel_img/Kandalama.jpg';
import JetwingBlue from '../images/hotel_img/JetwingBlue.jpg';
import AmariGalle from '../images/hotel_img/AmariGalle.jpeg';
import Ella98Acres from '../images/hotel_img/Ella98Acres.jpg';
import EarlsRegency from '../images/hotel_img/EarlsRegency.jpg';
import ShangriLaHambantota from '../images/hotel_img/ShangriLaHambantota.jpg';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Hotels.css';

// Helper function to normalize names (removes spaces and hyphens) for accurate matching
const normalizeName = (name) => name ? name.replace(/[\s-]/g, '').toLowerCase() : '';

const hotelImages = {
  "cinnamongrandcolombo": CinnamonGrand,
  "shangrilacolombo": Shangrila,
  "galleface": GalleFace,
  "kingsbury": Kingsbury,
  "cinnamonred": CinnamonRed,
  "kandalama": Kandalama,
  "jetwingblue": JetwingBlue,
  "amarigalle": AmariGalle,
  "ella98acres": Ella98Acres,
  "earlsregency": EarlsRegency,
  "shangrilahambantota": ShangriLaHambantota,
};

// Function to get image based on name
const getHotelImage = (name, id) => {
  const cleanName = normalizeName(name);
  return hotelImages[cleanName];
};

const Hotels = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        location: ''
    });
    // State to store all fetched hotels
    const [allHotels, setAllHotels] = useState([]);
    // State to store hotels currently displayed (filtered)
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    // State for search suggestions
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5001/api/manager/hotels');

                const mappedHotels = response.data.map(h => ({
                    id: h.h_id,
                    title: h.h_name,
                    location: h.h_location,
                    price: h.base_price,
                    rating: 4.8,
                    // Use the helper function to find the correct image
                    image: getHotelImage(h.h_name, h.h_id)
                }));

                setAllHotels(mappedHotels);
                setHotels(mappedHotels);
            } catch (error) {
                console.error("Error fetching hotels:", error);
                alert("Failed to load hotels.");
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Filter from the original list, not the current state
        const filtered = allHotels.filter(h =>
            h.location.toLowerCase().includes(searchParams.location.toLowerCase())
        );
        setHotels(filtered);
        setSuggestions([]);
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
        // Filter and display hotels for this location
        const filtered = allHotels.filter(h =>
            h.location.toLowerCase() === suggestion.location.toLowerCase()
        );
        setHotels(filtered);
    };

    return (
        <div className="hotels-page">
            {/* Search Bar */}
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

            {/* Hotels Grid */}
            <section className="destinations-section">
                <div className="section-header">
                    <h2>Available Hotels</h2>
                    <p>Find Your Home Away From Home</p>
                </div>

                {loading ? (
                    <div className="loading-state" style={{ textAlign: 'center', padding: '50px' }}>
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p>Loading hotels...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>No hotels found. Please check back later!</p>
                    </div>
                ) : (
                    <div className="destinations-grid">
                        {hotels.map(hotel => (
                            <div
                                className="small-hotel-card"
                                key={hotel.id}
                                onClick={() => navigate(`/hotel/${hotel.id}`)}
                            >
                                <img src={hotel.image} alt={hotel.title} />
                                <div className="info">
                                    <h3>{hotel.title}</h3>
                                    <p>{hotel.location}</p>
                                    <div className="card-footer">
                                        <span className="rating">⭐ {hotel.rating}</span>
                                        <span className="price">Rs.{hotel.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {hotels.length > 0 && (
                    <div className="pagination">
                        <button disabled>&laquo;</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>&raquo;</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Hotels;