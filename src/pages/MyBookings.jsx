import React, { useEffect, useState } from "react";
import axios from "axios";
import PayButton from "../components/payButton";

const API = "http://localhost:5000/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${API}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(
        `${API}/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchBookings();
    } catch (error) {
      alert("Cancel failed");
    }
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading bookings...
      </h2>
    );

  if (!bookings.length)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        No bookings found
      </h2>
    );

  return (
    <div style={{ maxWidth: "1100px", margin: "auto", padding: "30px" }}>
      <h1 style={{ marginBottom: "30px" }}>My Bookings</h1>

      {bookings.map((booking) => {
        const isPaid = booking.payment?.status === "PAID";
        const isCancelled = booking.status === "CANCELLED";
        const canCancel =
          booking.status !== "CANCELLED" &&
          booking.status !== "COMPLETED";

        return (
          <div
            key={booking._id}
            style={{
              marginBottom: "35px",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              background: "#111",
              color: "white",
            }}
          >
            {/* IMAGE */}
            <img
              src={booking.hotel?.images?.[0]}
              alt="hotel"
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "20px" }}>
              <h2>{booking.hotel?.name}</h2>

              <p>
                {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>

              <h2 style={{ marginTop: "10px" }}>
                ₹{booking.totalAmount}
              </h2>

              {/* STATUS BADGE */}
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  margin: "12px 0",
                  fontWeight: "bold",
                  background: isPaid
                    ? "#16a34a"
                    : isCancelled
                    ? "#dc2626"
                    : "#f59e0b",
                }}
              >
                {isPaid
                  ? "PAID"
                  : isCancelled
                  ? "CANCELLED"
                  : booking.status}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "12px" }}>
                {/* PAY BUTTON */}
                {!isPaid && !isCancelled && (
                  <PayButton
                    bookingId={booking._id}
                    onSuccess={fetchBookings}
                  />
                )}

                {/* CANCEL BUTTON */}
                {canCancel && !isPaid && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    style={{
                      height: "42px",
                      padding: "0 20px",
                      background: "#ef4444",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}