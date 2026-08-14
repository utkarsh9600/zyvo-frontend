import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://zyvo-backend-409g.onrender.com";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const BookingCard = ({ booking, refresh }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const amount =
    booking.totalPrice ||
    booking.pricing?.finalAmount ||
    0;

  const paymentStatus =
    booking.payment?.status ||
    booking.paymentStatus ||
    "PENDING";

  const handleCancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/bookings/${booking._id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refresh();
    } catch {
      alert("Cancellation failed");
    }
  };

  return (
    <div className="booking-card">

      <img
        src={
          booking.hotel?.images?.[0] ||
          "/default-hotel.jpg"
        }
        alt={booking.hotel?.name}
      />

      <div className="card-body">
        <h3>{booking.hotel?.name}</h3>

        <p>
          {new Date(
            booking.checkIn
          ).toLocaleDateString()} –{" "}
          {new Date(
            booking.checkOut
          ).toLocaleDateString()} ({nights} nights)
        </p>

        <div className="price">
          {formatCurrency(amount)}
        </div>

        <div className="status">
          {booking.status} | {paymentStatus}
        </div>

        <div className="actions">
          <button
            onClick={() =>
              navigate(`/bookings/${booking._id}`)
            }
          >
            View
          </button>

          {paymentStatus !== "PAID" &&
            booking.status !== "CANCELLED" && (
              <button disabled>
                Pay via Razorpay
              </button>
            )}

          {booking.status === "CONFIRMED" && (
            <button onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default BookingCard;