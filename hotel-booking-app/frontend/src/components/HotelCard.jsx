import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import images
import CinnamonGrand       from '../images/hotel_img/Cinnamon Grand Colombo.jpg';
import Shangrila             from '../images/hotel_img/Shangri-La Colombo.jpg';
import GalleFace             from '../images/hotel_img/GalleFace.jpeg';
import Kingsbury             from '../images/hotel_img/Kingsbury.jpg';
import CinnamonRed           from '../images/hotel_img/CinnamonRed.jpg';
import Kandalama             from '../images/hotel_img/Kandalama.jpg';
import JetwingBlue           from '../images/hotel_img/JetwingBlue.jpg';
import AmariGalle            from '../images/hotel_img/AmariGalle.jpeg';
import Ella98Acres           from '../images/hotel_img/Ella98Acres.jpg';
import EarlsRegency          from '../images/hotel_img/EarlsRegency.jpg';
import ShangriLaHambantota   from '../images/hotel_img/ShangriLaHambantota.jpg';

// Helper to normalize name matching
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

const HotelCard = ({ id, title, location, rating, price, image }) => {
  const navigate = useNavigate();

  // Determine the image source: 
  // 1. Use passed 'image' prop (Best)
  // 2. Try to match by title if prop is missing
  // 3. Fallback to placeholder
  const finalImage = image || hotelImages[normalizeName(title)] || CinnamonGrand;

  return (
    <div
      className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      {/* Hotel Image */}
      <div className="relative">
        <img
          src={finalImage}
          alt={title}
          className="w-full h-52 object-cover"
        />
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-yellow-400 text-white font-semibold px-2 py-1 rounded flex items-center space-x-1">
          <i className="fa-solid fa-star"></i>
          <span>{rating || 4.5}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{location}</p>

        {/* Price */}
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-gray-400 text-sm">Starting from</span>
          <span className="text-blue-600 font-semibold text-lg">Rs.{price}</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;