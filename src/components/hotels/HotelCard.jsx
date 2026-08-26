import React, { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Hotelcard.css";

const FALLBACK = "/no-image.webp";

const HotelCard = memo(({ hotel, priority = false }) => {
  const navigate = useNavigate();

  const [src, setSrc] = useState(
    hotel.images?.[0] || FALLBACK
  );

  const {
    _id,
    name = "Unnamed Hotel",
    city = "Unknown Location",
    rating = 4.5,
    price = 0,
    originalPrice,
    amenities = [],
    availableRooms = 2,
  } = hotel;

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleImageError = () => {
    if (src !== FALLBACK) {
      setSrc(FALLBACK);
    }
  };

  const handleCardClick = () => {
    navigate(`/hotels/${_id}`);
  };

  return (
    <article
      className="hotel-card"
      onClick={handleCardClick}
      tabIndex={0}
      role="link"
    >
      <div className="hotel-card__image-wrapper">
        <img
          src={src}
          alt={`${name} hotel`}
          width="400"
          height="250"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={handleImageError}
        />

        {rating > 0 && (
          <span className="hotel-card__rating">
            ⭐ {rating}
          </span>
        )}

        {discount > 0 && (
          <span className="hotel-card__discount">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="hotel-card__content">
        <h3>{name}</h3>

        <p>📍 {city}</p>

        {amenities.length > 0 && (
          <div className="hotel-card__amenities">
            {amenities.slice(0, 3).map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        )}

        <div className="hotel-card__pricing">
          <strong>
            ₹{price.toLocaleString("en-IN")}
          </strong>

          {originalPrice > price && (
            <del>
              ₹{originalPrice.toLocaleString("en-IN")}
            </del>
          )}
        </div>

        {availableRooms <= 2 && availableRooms > 0 && (
          <small>
            🔥 Only {availableRooms} room left
          </small>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/hotels/${_id}`);
          }}
        >
          View Details
        </button>
      </div>
    </article>
  );
});

HotelCard.propTypes = {
  hotel: PropTypes.object.isRequired,
  priority: PropTypes.bool,
};

export default HotelCard;