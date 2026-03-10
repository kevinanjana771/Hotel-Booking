import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HotelCard.css';

const HotelCard = ({ id, title, location, rating, price, image }) => {
  const navigate = useNavigate();

  return (
    <div
      className="hotel-card"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="hotel-image">
        <img src={image} alt={title} className="hotel-img" />
      </div>

      <div className="hotel-info">
        <h3 className="hotel-title">{title}</h3>
        <p className="hotel-location">{location}</p>

        <div className="hotel-price">
          Starting from <span className="price-amount">Rs.{price}</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;