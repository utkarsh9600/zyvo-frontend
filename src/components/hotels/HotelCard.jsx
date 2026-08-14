import React, { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Hotelcard.css"; // Make sure this path is correct

const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";
const FALLBACK_IMAGE = "https://via.placeholder.com/400x300?text=Image+Not+Found";

const HotelCard = memo(({ hotel }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(hotel?.images?.[0] || DEFAULT_IMAGE);

  // Format price with Indian number formatting
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);

  const handleImageError = useCallback(() => {
    setImgSrc(FALLBACK_IMAGE);
  }, []);

  const handleCardClick = useCallback(() => {
    navigate(`/hotels/${hotel._id}`);
  }, [navigate, hotel._id]);

  const handleViewDetails = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent card click from firing twice
      navigate(`/hotels/${hotel._id}`);
    },
    [navigate, hotel._id]
  );

  const {
    name = "Unnamed Hotel",
    city = "Unknown Location",
    rating = 4.5,
    price = 0,
    originalPrice = null,
    amenities = [],
    availableRooms = 2,
    taxAndFees = "₹299 + taxes",
  } = hotel;

  const discountPercent =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const isAlmostSoldOut = availableRooms <= 2 && availableRooms > 0;

  return (
    <article className="hotel-card" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* IMAGE SECTION */}
      <div className="hotel-card__image-wrapper">
        <img
          src={imgSrc}
          alt={`${name} hotel`}
          className="hotel-card__image"
          loading="lazy"
          onError={handleImageError}
        />
        {rating && (
          <span className="hotel-card__rating" aria-label={`Rating ${rating} out of 5`}>
            <span aria-hidden="true">⭐</span> {rating}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="hotel-card__discount" aria-label={`${discountPercent} percent off`}>
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="hotel-card__content">
        <h3 className="hotel-card__title">{name}</h3>
        <p className="hotel-card__location">
          <span aria-hidden="true">📍</span> {city}
        </p>

        {/* AMENITIES CHIPS */}
        {amenities.length > 0 && (
          <div className="hotel-card__amenities">
            {amenities.slice(0, 3).map((item) => (
              <span key={item} className="hotel-card__amenity">
                {item}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="hotel-card__amenity hotel-card__amenity--more">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* PRICING */}
        <div className="hotel-card__pricing">
          <div className="hotel-card__price">
            <span className="hotel-card__price--current">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="hotel-card__price--original">{formatPrice(originalPrice)}</span>
            )}
          </div>
          <span className="hotel-card__tax-info">{taxAndFees}</span>
        </div>

        {/* URGENCY + CTA */}
        <div className="hotel-card__footer">
          {isAlmostSoldOut && (
            <span className="hotel-card__urgency">
              🔥 Only {availableRooms} room{availableRooms > 1 ? "s" : ""} left
            </span>
          )}
          <button
            className="hotel-card__button"
            onClick={handleViewDetails}
            aria-label={`View details for ${name}`}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
});

HotelCard.displayName = "HotelCard";

HotelCard.propTypes = {
  hotel: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    city: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    amenities: PropTypes.arrayOf(PropTypes.string),
    availableRooms: PropTypes.number,
    taxAndFees: PropTypes.string,
  }).isRequired,
};

export default HotelCard;