import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ---------- Helper function to format date ----------
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// ---------- Calculate nights between two dates ----------
const calculateNights = (checkIn, checkOut) => {
  const diffMs = new Date(checkOut) - new Date(checkIn);
  const nights = diffMs / (1000 * 60 * 60 * 24);
  return nights > 0 ? nights : 0;
};

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ---------- Redirect if no booking data ----------
  if (!state || !state.hotelName || !state.checkIn || !state.checkOut) {
    return (
      <div style={styles.errorContainer}>
        <h2>❌ Booking information missing</h2>
        <button
          onClick={() => navigate("/search")}
          style={styles.primaryButton}
        >
          Browse Hotels
        </button>
      </div>
    );
  }

  const { hotelName, city, checkIn, checkOut, pricePerNight, hotelImage } = state;

  const nights = calculateNights(checkIn, checkOut);
  const basePrice = nights * pricePerNight;
  const tax = basePrice * 0.12; // 12% GST example
  const total = basePrice + tax;

  // ---------- Handle booking confirmation ----------
  const confirmBooking = async () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const booking = {
        ...state,
        nights,
        basePrice,
        tax,
        total,
        status: "CONFIRMED",
        paymentStatus: "PENDING",
        createdAt: new Date().toISOString(),
        bookingId: "BK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      };

      // Save to localStorage
      const existingBookings =
        JSON.parse(localStorage.getItem("myBookings")) || [];
      localStorage.setItem(
        "myBookings",
        JSON.stringify([booking, ...existingBookings])
      );

      setLoading(false);
      navigate("/payment", { state: booking });
    }, 800);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <h2 style={styles.heading}>Review your booking</h2>
      </div>

      {/* Main card */}
      <div style={styles.card}>
        {/* Hotel Image (if available) */}
        {hotelImage && (
          <img src={hotelImage} alt={hotelName} style={styles.hotelImage} />
        )}

        {/* Hotel info */}
        <div style={styles.hotelInfo}>
          <h3 style={styles.hotelName}>{hotelName}</h3>
          <p style={styles.city}>{city}</p>
        </div>

        {/* Dates summary */}
        <div style={styles.row}>
          <div style={styles.dateBox}>
            <span style={styles.label}>Check‑in</span>
            <span style={styles.value}>{formatDate(checkIn)}</span>
          </div>
          <div style={styles.dateBox}>
            <span style={styles.label}>Check‑out</span>
            <span style={styles.value}>{formatDate(checkOut)}</span>
          </div>
        </div>
        <p style={styles.nightsInfo}>
          {nights} night{nights > 1 ? "s" : ""} ·{" "}
          <button
            onClick={() => navigate("/search")}
            style={styles.changeLink}
          >
            Change dates
          </button>
        </p>

        {/* Price breakdown */}
        <div style={styles.priceBreakdown}>
          <div style={styles.priceRow}>
            <span>
              ₹{pricePerNight} x {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>₹{basePrice.toFixed(2)}</span>
          </div>
          <div style={styles.priceRow}>
            <span>Taxes & fees (12% GST)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div style={{ ...styles.priceRow, fontWeight: "bold", marginTop: 8 }}>
            <span>Total (incl. taxes)</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Secure checkout notice */}
        <div style={styles.secureNotice}>
          🔒 Secure checkout – your info is protected
        </div>

        {/* Proceed button */}
        <button
          onClick={confirmBooking}
          disabled={loading}
          style={{
            ...styles.primaryButton,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Processing…" : `Proceed to pay ₹${total.toFixed(2)}`}
        </button>

        {/* Cancellation hint */}
        <p style={styles.cancelHint}>
          Free cancellation up to 24 hours before check‑in.
        </p>
      </div>
    </div>
  );
};

// ---------- Styles (can be moved to a separate CSS file) ----------
const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    color: "#007bff",
    padding: "8px 12px",
    borderRadius: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 600,
    margin: 0,
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
    padding: 24,
    border: "1px solid #eef2f6",
  },
  hotelImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 16,
    marginBottom: 16,
  },
  hotelInfo: {
    marginBottom: 20,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 600,
    margin: "0 0 4px 0",
  },
  city: {
    color: "#5e6f88",
    margin: 0,
  },
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 8,
  },
  dateBox: {
    flex: 1,
    background: "#f8fafd",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 500,
  },
  nightsInfo: {
    margin: "8px 0 20px 0",
    color: "#334155",
  },
  changeLink: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 14,
  },
  priceBreakdown: {
    background: "#f1f5f9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 6,
  },
  secureNotice: {
    fontSize: 14,
    color: "#2d6a4f",
    background: "#e8f5e9",
    padding: "10px 16px",
    borderRadius: 12,
    marginBottom: 20,
    textAlign: "center",
    border: "1px solid #a5d6a7",
  },
  primaryButton: {
    width: "100%",
    padding: "16px 24px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    marginBottom: 16,
  },
  buttonDisabled: {
    background: "#a0c4ff",
    cursor: "not-allowed",
  },
  cancelHint: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    margin: 0,
  },
  errorContainer: {
    textAlign: "center",
    padding: 40,
  },
};

export default Booking;