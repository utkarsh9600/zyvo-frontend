import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: receive error details from previous page (e.g., from verify failure)
  const { errorCode, errorMessage, bookingId } = location.state || {};

  const defaultMessage = "We couldn't process your payment. Your card has not been charged.";
  const displayMessage = errorMessage || defaultMessage;

  const handleRetry = () => {
    // Go back to the payment page (or booking summary)
    navigate(-1); // or navigate(`/payment/${bookingId}`) if you have that route
  };

  const handleViewBookings = () => {
    navigate("/my-bookings");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@stayza.com?subject=Payment%20Failed%20Help";
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Animated failure icon */}
        <div style={styles.iconContainer}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.iconSvg}
          >
            <circle cx="12" cy="12" r="10" stroke="#b91c1c" strokeWidth="1.5" />
            <path
              d="M8 8L16 16M8 16L16 8"
              stroke="#b91c1c"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 style={styles.title}>Payment Failed</h2>

        <p style={styles.message}>{displayMessage}</p>

        {errorCode && (
          <div style={styles.errorCodeBox}>
            <span style={styles.errorCodeLabel}>Error code:</span>
            <span style={styles.errorCodeValue}>{errorCode}</span>
          </div>
        )}

        {bookingId && (
          <p style={styles.bookingId}>Booking ID: {bookingId}</p>
        )}

        <div style={styles.helpText}>
          <p>Need help? Contact our support team.</p>
        </div>

        <div style={styles.btnGroup}>
          <button style={styles.primaryBtn} onClick={handleRetry}>
            🔄 Try Again
          </button>

          <button style={styles.secondaryBtn} onClick={handleViewBookings}>
            📋 My Bookings
          </button>

          <button style={styles.tertiaryBtn} onClick={handleContactSupport}>
            💬 Support
          </button>
        </div>

        <div style={styles.footerNote}>
          <p>Your money is safe – no amount has been deducted.</p>
        </div>
      </div>
    </div>
  );
}

// Modern, responsive inline styles (easily convertible to CSS modules)
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%)",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    maxWidth: "480px",
    width: "100%",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15), 0 8px 24px -6px rgba(185,28,28,0.1)",
    padding: "40px 32px",
    textAlign: "center",
    transition: "transform 0.2s ease",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  iconSvg: {
    filter: "drop-shadow(0 8px 12px rgba(185,28,28,0.2))",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e1e2f",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  },
  message: {
    fontSize: "16px",
    color: "#4a4a68",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  errorCodeBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "40px",
    padding: "8px 16px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  errorCodeLabel: {
    fontSize: "14px",
    color: "#7f1d1d",
    fontWeight: "500",
  },
  errorCodeValue: {
    fontSize: "14px",
    color: "#b91c1c",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  bookingId: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  helpText: {
    marginTop: "8px",
    marginBottom: "28px",
    color: "#6b7280",
    fontSize: "15px",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "20px",
  },
  btnGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "24px",
  },
  primaryBtn: {
    background: "#8B0000",
    color: "#fff",
    border: "none",
    borderRadius: "40px",
    padding: "12px 28px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 10px rgba(139,0,0,0.3)",
    flex: "1 1 auto",
    minWidth: "140px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  secondaryBtn: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "40px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
    flex: "1 1 auto",
    minWidth: "140px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  tertiaryBtn: {
    background: "transparent",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    borderRadius: "40px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
    flex: "1 1 auto",
    minWidth: "120px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  footerNote: {
    fontSize: "14px",
    color: "#059669",
    background: "#ecfdf5",
    padding: "12px 16px",
    borderRadius: "40px",
    border: "1px solid #a7f3d0",
  },
};