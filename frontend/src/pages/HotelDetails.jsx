import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HotelDetails.css';

// --- 1. IMPORT LOCAL IMAGES ---
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

// --- 2. IMAGE MAPPING LOGIC ---
// Helper to clean up names (remove spaces/hyphens) to match filenames
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

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for Image Carousel
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch Hotel Details
    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/manager/hotels/${id}`);
                setHotel(response.data);
            } catch (error) {
                console.error("Error fetching hotel details:", error);
                alert("Failed to load hotel details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchHotelDetails();
    }, [id]);

    // --- 3. UPDATED IMAGE LOGIC ---
    // Generate images for the carousel
    const getImages = () => {
        if (!hotel) return [];

        // A. Try to find the specific local image for this hotel
        const mainImage = hotelImages[normalizeName(hotel.h_name)];

        // B. Create a gallery array
        // Index 0: The actual local image of the hotel
        // Index 1-3: Generic placeholders to simulate interior/pool/food views
        // (We use picsum.photos because source.unsplash.com is currently broken/reliable)
        return [
            mainImage || `https://via.placeholder.com/1200x800?text=${encodeURIComponent(hotel.h_name)}`, // Main Image
            `https://picsum.photos/seed/${hotel.h_id}interior/1200/800`, // Placeholder Interior
            `https://picsum.photos/seed/${hotel.h_id}pool/1200/800`,     // Placeholder Pool
            `https://picsum.photos/seed/${hotel.h_id}food/1200/800`,     // Placeholder Food
        ];
    };

    const images = getImages();

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Handle booking click from a specific room card
    const handleSelectRoom = (roomType, price) => {
        // Check for u_id (User Login)
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Please login to make a reservation.");
            navigate('/login');
            return;
        }

        // Navigate to Booking Page with Room details
        navigate(`/booking/${hotel.h_id}`, {
            state: {
                hotelName: hotel.h_name,
                basePrice: hotel.base_price,
                roomType: roomType,
                selectedPrice: price
            }
        });
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Hotel Details...</div>;
    if (!hotel) return <div style={{ padding: '100px', textAlign: 'center' }}>Hotel not found.</div>;

    return (
        <div className="details-page">
            <div className="details-container">

                {/* --- GALLERY CAROUSEL --- */}
                <div className="gallery-carousel">
                    <button className="carousel-arrow left" onClick={prevImage}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <img
                        src={images[currentImageIndex]}
                        alt={`${hotel.h_name} view`}
                        className="carousel-image"
                    />

                    <button className="carousel-arrow right" onClick={nextImage}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                {/* --- CONTENT WRAPPER --- */}
                <div className="content-wrapper-single">
                    <div className="main-info">
                        <h1>{hotel.h_name}</h1>
                        <div className="location-badge">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>{hotel.h_location}</span>
                        </div>

                        {/* 1. OVERVIEW SECTION */}
                        <div className="content-section">
                            <h2>Overview</h2>
                            <p>{hotel.h_description}</p>
                        </div>

                        {/* 2. FACILITIES SECTION */}
                        <div className="content-section facilities-section">
                            <h3>Top facilities</h3>
                            <div className="facilities">
                                <div className="facility"><i className="fa-solid fa-wifi"></i> Free Wifi</div>
                                <div className="facility"><i className="fa-solid fa-person-swimming"></i> Swimming Pool</div>
                                <div className="facility"><i className="fa-solid fa-utensils"></i> Restaurant</div>
                                <div className="facility"><i className="fa-solid fa-dumbbell"></i> Fitness Center</div>
                            </div>
                        </div>

                        {/* 3. ROOMS SECTION */}
                        <div className="content-section rooms-section">
                            <h2>Select Your Room</h2>
                            <div className="rooms-grid-straight">
                                {/* Standard Room */}
                                <div className="room-card-simple">
                                    <div className="room-icon"><i className="fa-solid fa-bed"></i></div>
                                    <h3>Standard Room</h3>
                                    <p>Comfortable stay with essential amenities.</p>
                                    <div className="room-price-tag">Rs.{hotel.standard_price} <span>/ night</span></div>
                                    <button
                                        className="btn-book-room"
                                        onClick={() => handleSelectRoom('Standard', hotel.standard_price)}
                                    >
                                        Select Room
                                    </button>
                                </div>

                                {/* Deluxe Room */}
                                <div className="room-card-simple">
                                    <div className="room-icon"><i className="fa-solid fa-martini-glass"></i></div>
                                    <h3>Deluxe / Duplex</h3>
                                    <p>Spacious room with premium views.</p>
                                    <div className="room-price-tag">Rs.{hotel.deluxe_price} <span>/ night</span></div>
                                    <button
                                        className="btn-book-room"
                                        onClick={() => handleSelectRoom('Deluxe', hotel.deluxe_price)}
                                    >
                                        Select Room
                                    </button>
                                </div>

                                {/* Suite */}
                                <div className="room-card-simple">
                                    <div className="room-icon"><i className="fa-solid fa-crown"></i></div>
                                    <h3>Executive Suite</h3>
                                    <p>Top-tier luxury with separate living area.</p>
                                    <div className="room-price-tag">Rs.{hotel.suite_price} <span>/ night</span></div>
                                    <button
                                        className="btn-book-room"
                                        onClick={() => handleSelectRoom('Suite', hotel.suite_price)}
                                    >
                                        Select Room
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;