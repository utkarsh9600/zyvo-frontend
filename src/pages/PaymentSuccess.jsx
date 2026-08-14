import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract booking details from state (passed from payment verification)
  const { bookingId, hotelName, checkIn, checkOut, totalAmount } = location.state || {};

  const [showConfetti, setShowConfetti] = useState(false);

  // Optional: trigger confetti effect on mount
  useEffect(() => {
    setShowConfetti(true);
    // You could integrate a real confetti library here, but we'll keep it simple.
  }, []);

  const handleDownloadReceipt = () => {
    // In a real app, this would trigger a PDF download
    alert("Receipt download started (mock)");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My STAYZA Booking",
        text: `I just booked ${hotelName || "a hotel"} on STAYZA!`,
        url: window.location.origin,
      });
    } else {
      alert("Share link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Animated success icon */}
        <div style={styles.iconContainer}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.iconSvg}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <path
              d="M8 12L11 15L16 9"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 style={styles.title}>Payment Successful! 🎉</h2>
        <p style={styles.subtitle}>Your booking has been confirmed.</p>

        {/* Booking summary card */}
        {(bookingId || hotelName) && (
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Booking Summary</h3>
            {bookingId && (
              <p style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Booking ID:</span>
                <span style={styles.summaryValue}>{bookingId}</span>
              </p>
            )}
            {hotelName && (
              <p style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Hotel:</span>
                <span style={styles.summaryValue}>{hotelName}</span>
              </p>
            )}
            {checkIn && (
              <p style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Check-in:</span>
                <span style={styles.summaryValue}>{formatDate(checkIn)}</span>
              </p>
            )}
            {checkOut && (
              <p style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Check-out:</span>
                <span style={styles.summaryValue}>{formatDate(checkOut)}</span>
              </p>
            )}
            {totalAmount && (
              <p style={{ ...styles.summaryRow, fontWeight: "bold" }}>
                <span style={styles.summaryLabel}>Amount paid:</span>
                <span style={styles.summaryValue}>₹{totalAmount}</span>
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={styles.btnGroup}>
          <button style={styles.primaryBtn} onClick={() => navigate("/my-bookings")}>
            📋 View My Bookings
          </button>
          <button style={styles.secondaryBtn} onClick={handleDownloadReceipt}>
            📄 Download Receipt
          </button>
          <button style={styles.tertiaryBtn} onClick={handleShare}>
            🔗 Share
          </button>
          <button style={styles.tertiaryBtn} onClick={() => navigate("/")}>
            🏠 Go Home
          </button>
        </div>

        {/* Reassurance message */}
        <p style={styles.footerNote}>
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

// Premium, responsive styles
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(145deg, #f0f9ff 0%, #e6f7f0 100%)",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    maxWidth: "560px",
    width: "100%",
    background: "#ffffff",
    borderRadius: "32px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 8px 20px -8px rgba(16,185,129,0.15)",
    padding: "48px 40px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    animation: "fadeInUp 0.6s ease",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  iconSvg: {
    filter: "drop-shadow(0 12px 16px rgba(16,185,129,0.3))",
    animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e1e2f",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "18px",
    color: "#4a4a68",
    marginBottom: "32px",
  },
  summaryCard: {
    background: "#f8fafc",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "32px",
    textAlign: "left",
    border: "1px solid #e2e8f0",
  },
  summaryTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid #cbd5e1",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "15px",
    color: "#334155",
  },
  summaryLabel: {
    fontWeight: "500",
    color: "#64748b",
  },
  summaryValue: {
    fontWeight: "600",
    color: "#0f172a",
  },
  btnGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "28px",
  },
  primaryBtn: {
    background: "#8B0000",
    color: "#fff",
    border: "none",
    borderRadius: "40px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 8px 18px rgba(139,0,0,0.3)",
    flex: "1 1 auto",
    minWidth: "180px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  secondaryBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "40px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    boxShadow: "0 8px 18px rgba(16,185,129,0.3)",
    flex: "1 1 auto",
    minWidth: "160px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  tertiaryBtn: {
    background: "#f1f5f9",
    color: "#334155",
    border: "1px solid #cbd5e1",
    borderRadius: "40px",
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
    flex: "1 1 auto",
    minWidth: "130px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  footerNote: {
    fontSize: "14px",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "12px 16px",
    borderRadius: "40px",
    border: "1px solid #e2e8f0",
    marginTop: "8px",
  },
};

// Add keyframes for animations (can be added in global CSS or via styled-components)
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// @keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }