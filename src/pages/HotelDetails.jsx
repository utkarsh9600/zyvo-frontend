import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";
import "./HotelDetails.css";

const API = "http://localhost:5000";

/* ================= UTILITIES ================= */

const formatPrice = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

/* ================= COMPONENT ================= */

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH HOTEL ================= */

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`${API}/api/hotels/${id}`);

        const hotelData = res.data.hotel || res.data;

        if (!hotelData) {
          setError("Hotel not found.");
          return;
        }

        setHotel(hotelData);

        if (hotelData.rooms?.length) {
          setRooms(hotelData.rooms);
          setSelectedRoom(hotelData.rooms[0]._id);
        } else {
          const fallbackRoom = {
            _id: "default",
            type: "Standard Room",
            price: hotelData.price || 999,
            available: 5,
          };
          setRooms([fallbackRoom]);
          setSelectedRoom("default");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load hotel. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  /* ================= DERIVED VALUES ================= */

  const nights = useMemo(
    () => calculateNights(checkIn, checkOut),
    [checkIn, checkOut]
  );

  const selectedRoomData = useMemo(
    () =>
      rooms.find((r) => r._id === selectedRoom) ||
      rooms[0] ||
      null,
    [rooms, selectedRoom]
  );

  const totalPrice = useMemo(() => {
    if (!selectedRoomData || nights <= 0) return 0;
    return selectedRoomData.price * nights;
  }, [selectedRoomData, nights]);

  /* ================= BOOKING ================= */

  const handleBooking = () => {
    if (!token) return navigate("/login");

    if (!checkIn || !checkOut)
      return alert("Please select dates.");

    if (nights <= 0)
      return alert("Check-out must be after check-in.");

    navigate(
      `/payment/${hotel._id}?checkIn=${checkIn}&checkOut=${checkOut}&room=${selectedRoom}&total=${totalPrice}`
    );
  };

  const today =
    new Date().toISOString().split("T")[0];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="hotel-details loading">
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hotel-details error">
        <h2>{error}</h2>
        <button onClick={() => navigate("/hotels")}>
          Back to Hotels
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="hotel-details">

      {/* HEADER */}
      <div className="hotel-header">
        <h1>👑 {hotel.name}</h1>
        <p>📍 {hotel.city}, {hotel.state || "India"}</p>
        {hotel.rating && <div>⭐ {hotel.rating}</div>}
      </div>

      {/* GALLERY */}
      <div className="hotel-gallery">
        <img
          src={
            hotel.images?.[activeImage] ||
            "/hotel-placeholder.jpg"
          }
          alt={hotel.name}
          className="main-image"
          onClick={() => setLightboxOpen(true)}
        />

        {hotel.images?.length > 1 && (
          <div className="thumbnail-row">
            {hotel.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                className={
                  activeImage === index
                    ? "thumb active"
                    : "thumb"
                }
                onClick={() =>
                  setActiveImage(index)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="lightbox"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                hotel.images?.[activeImage]
              }
              alt="Preview"
            />
            <button
              onClick={() =>
                setLightboxOpen(false)
              }
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="hotel-grid">

        {/* LEFT SIDE */}
        <div className="hotel-left">
          <h2>About</h2>
          <p>
            {hotel.description ||
              `Premium stay in ${hotel.city} with modern comfort and seamless booking.`}
          </p>

          <h2>Amenities</h2>
          <div className="amenities">
            {(hotel.amenities || [
              "Free WiFi",
              "AC Rooms",
              "Room Service",
              "24x7 Support",
            ]).map((item, i) => (
              <span key={i}>✓ {item}</span>
            ))}
          </div>

          <h2>Reviews</h2>
          <ReviewSection hotelId={hotel._id} />
        </div>

        {/* RIGHT SIDE BOOKING */}
        <div className="hotel-right">
          <div className="booking-card">

            <div className="price">
              {formatPrice(
                selectedRoomData?.price ||
                hotel.price
              )} / night
            </div>

            {rooms.length > 1 && (
              <select
                value={selectedRoom}
                onChange={(e) =>
                  setSelectedRoom(
                    e.target.value
                  )
                }
              >
                {rooms.map((room) => (
                  <option
                    key={room._id}
                    value={room._id}
                  >
                    {room.type} -{" "}
                    {formatPrice(
                      room.price
                    )}
                  </option>
                ))}
              </select>
            )}

            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) =>
                setCheckIn(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) =>
                setCheckOut(
                  e.target.value
                )
              }
              disabled={!checkIn}
            />

            {nights > 0 && (
              <div className="summary">
                <div>Nights: {nights}</div>
                <div>
                  Total:{" "}
                  {formatPrice(
                    totalPrice
                  )}
                </div>
              </div>
            )}

            <button
              className="book-btn"
              onClick={handleBooking}
            >
              Book Now →
            </button>

            <div className="trust">
              🔒 Secure Payment  
              ✅ Free Cancellation  
              ⭐ Verified Stay
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDetails;