import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import './Hotels.css';

// Import hotel images
import CinnamonGrand from '../images/hotel_img/Cinnamon Grand Colombo.jpg';
import Shangrila from '../images/hotel_img/Shangri-La Colombo.jpg';
import GallFace from '../images/hotel_img/GalleFace.jpeg';
import Kingsbury from '../images/hotel_img/Kingsbury.jpg';
import CinnamonRed from '../images/hotel_img/CinnamonRed.jpg';
import Kandalama from '../images/hotel_img/Kandalama.jpg';
import JetwingBlue from '../images/hotel_img/JetwingBlue.jpg';
import AmariGalle from '../images/hotel_img/AmariGalle.jpeg';
import Ella98Acres from '../images/hotel_img/Ella98Acres.jpg';
import EarlsRegency from '../images/hotel_img/EarlsRegency.jpg';
import ShangriLaHambantota from '../images/hotel_img/ShangriLaHambantota.jpg';

// Map hotel ID → image
const hotelImages = {
  9: CinnamonGrand,
  10: Shangrila,
  11: GallFace,
  12: Kingsbury,
  13: CinnamonRed,
  14: Kandalama,
  15: JetwingBlue,
  16: AmariGalle,
  17: Ella98Acres,
  18: EarlsRegency,
  19: ShangriLaHambantota
};

const Hotels = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    location: ''
  });

  const [allHotels, setAllHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          'http://localhost:5001/api/manager/hotels'
        );

        const mappedHotels = response.data.map((h) => ({
          id: h.h_id,
          title: h.h_name,
          location: h.h_location,
          price: h.base_price,
          rating: 4.8,
          image: hotelImages[h.h_id]
        }));

        setAllHotels(mappedHotels);
        setHotels(mappedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = allHotels.filter((hotel) =>
      hotel.location
        .toLowerCase()
        .includes(searchParams.location.toLowerCase())
    );

    setHotels(filtered);
    setSuggestions([]);
  };

  // Input change
  const handleInputChange = (e) => {
    const value = e.target.value;

    setSearchParams({ location: value });

    if (value.trim() !== '') {
      const filtered = allHotels.filter(
        (h) =>
          h.location.toLowerCase().includes(value.toLowerCase()) ||
          h.title.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (hotel) => {
    setSearchParams({ location: hotel.location });
    setSuggestions([]);

    const filtered = allHotels.filter(
      (h) => h.location.toLowerCase() === hotel.location.toLowerCase()
    );

    setHotels(filtered);
  };

  return (
    <div className="hotels-page">

      {/* Search */}
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
              />
            </div>

            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <i className="fa-solid fa-map-pin"></i>
                    {s.location}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="search-button-upgraded">
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </form>
      </section>

      {/* Hotel list */}
      <section className="destinations-section">
        <div className="section-header">
          <h2>Available Hotels</h2>
          <p>Find Your Home Away From Home</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p>Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No hotels found</p>
        ) : (
          <div className="destinations-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                id={hotel.id}
                title={hotel.title}
                location={hotel.location}
                price={hotel.price}
                rating={hotel.rating}
                image={hotel.image}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Hotels;