import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Download,
  Share2,
} from "lucide-react";

const API = "https://zyvo-backend-409g.onrender.com";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please login to view booking details");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = res.data.bookings.find((b) => b._id === id);
        if (!found) {
          setError("Booking not found");
        } else {
          setBooking(found);
        }
      } catch (err) {
        setError("Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, token]);

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge config
  const getStatusConfig = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          icon: <CheckCircle size={20} />,
          color: "#059669",
          bg: "#ecfdf5",
          text: "Confirmed",
        };
      case "CANCELLED":
        return {
          icon: <XCircle size={20} />,
          color: "#b91c1c",
          bg: "#fef2f2",
          text: "Cancelled",
        };
      case "PENDING":
        return {
          icon: <AlertCircle size={20} />,
          color: "#b45309",
          bg: "#fffbeb",
          text: "Pending",
        };
      default:
        return {
          icon: <Clock size={20} />,
          color: "#6b7280",
          bg: "#f3f4f6",
          text: status,
        };
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return { color: "#059669", bg: "#ecfdf5" };
      case "PENDING":
        return { color: "#b45309", bg: "#fffbeb" };
      case "FAILED":
        return { color: "#b91c1c", bg: "#fef2f2" };
      default:
        return { color: "#6b7280", bg: "#f3f4f6" };
    }
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Download invoice (mock function)
  const downloadInvoice = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Invoice downloaded successfully!");
    }, 1500);
  };

  // Share booking
  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: `Booking: ${booking?.hotel?.name}`,
        text: `Check out my booking at ${booking?.hotel?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Booking link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#b91c1c" />
        <h3 style={styles.errorTitle}>{error}</h3>
        <button onClick={() => navigate("/my-bookings")} style={styles.primaryButton}>
          ← Back to My Bookings
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const paymentStatus = getPaymentStatusColor(booking.paymentStatus || "PENDING");
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const taxAmount = booking.totalPrice * 0.12; // 12% GST
  const basePrice = booking.totalPrice - taxAmount;

  return (
    <div style={styles.container}>
      {/* Header with actions */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <div style={styles.headerActions}>
          <button onClick={shareBooking} style={styles.iconButton}>
            <Share2 size={20} />
          </button>
          <button
            onClick={downloadInvoice}
            disabled={downloading}
            style={{
              ...styles.iconButton,
              ...(downloading ? styles.disabledButton : {}),
            }}
          >
            <Download size={20} />
            {downloading ? "Downloading..." : "Invoice"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Booking Details</h1>
          <div style={styles.badgeGroup}>
            <div style={{ ...styles.statusBadge, background: statusConfig.bg, color: statusConfig.color }}>
              {statusConfig.icon}
              <span>{statusConfig.text}</span>
            </div>
            <div style={{ ...styles.statusBadge, background: paymentStatus.bg, color: paymentStatus.color }}>
              <CreditCard size={16} />
              <span>{booking.paymentStatus || "PENDING"}</span>
            </div>
          </div>
        </div>

        {/* Hotel Image (if available) */}
        {booking.hotel?.image && (
          <img src={booking.hotel.image} alt={booking.hotel.name} style={styles.hotelImage} />
        )}

        {/* Hotel Info Card */}
        <div style={styles.card}>
          <h2 style={styles.hotelName}>{booking.hotel?.name}</h2>
          <div style={styles.location}>
            <MapPin size={18} color="#6b7280" />
            <span style={styles.locationText}>{booking.hotel?.city}</span>
          </div>
        </div>

        {/* Stay Details Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Stay Details</h3>
          <div style={styles.datesGrid}>
            <div style={styles.dateBlock}>
              <span style={styles.dateLabel}>Check-in</span>
              <span style={styles.dateValue}>{formatDate(booking.checkIn)}</span>
              <span style={styles.dateTime}>2:00 PM</span>
            </div>
            <div style={styles.dateDivider}>→</div>
            <div style={styles.dateBlock}>
              <span style={styles.dateLabel}>Check-out</span>
              <span style={styles.dateValue}>{formatDate(booking.checkOut)}</span>
              <span style={styles.dateTime}>11:00 AM</span>
            </div>
          </div>
          <div style={styles.nightsBadge}>
            <Calendar size={16} />
            <span>{nights} Night{nights > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Price Breakdown Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Price Breakdown</h3>
          <div style={styles.priceRow}>
            <span>Room charges ({nights} nights)</span>
            <span>₹{basePrice.toFixed(2)}</span>
          </div>
          <div style={styles.priceRow}>
            <span>Taxes & fees (12% GST)</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div style={styles.divider}></div>
          <div style={{ ...styles.priceRow, ...styles.totalRow }}>
            <span>Total amount</span>
            <span style={styles.totalAmount}>₹{booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Booking Info Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Booking Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Booking ID</span>
            <span style={styles.infoValue}>{booking._id}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Booked on</span>
            <span style={styles.infoValue}>{formatDate(booking.createdAt)}</span>
          </div>
          {booking.specialRequests && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Special requests</span>
              <span style={styles.infoValue}>{booking.specialRequests}</span>
            </div>
          )}
        </div>

        {/* Cancellation Policy */}
        <div style={styles.policyCard}>
          <h4 style={styles.policyTitle}>Cancellation Policy</h4>
          <p style={styles.policyText}>
            Free cancellation up to 24 hours before check-in. Cancellations within 24 hours will be charged
            one night's room rate.
          </p>
        </div>

        {/* Need Help Section */}
        <div style={styles.helpSection}>
          <h4 style={styles.helpTitle}>Need help with this booking?</h4>
          <div style={styles.helpButtons}>
            <a href="tel:+919999999999" style={styles.helpButton}>
              <Phone size={18} />
              <span>Call us</span>
            </a>
            <a href="mailto:support@stayza.com" style={styles.helpButton}>
              <Mail size={18} />
              <span>Email us</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button onClick={() => navigate("/my-bookings")} style={styles.secondaryButton}>
            ← All Bookings
          </button>
          <button onClick={() => navigate("/")} style={styles.primaryButton}>
            Browse More Hotels →
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= STYLES =================
const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "20px",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    background: "#f9fafc",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    border: "3px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 16,
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 16,
  },
  errorContainer: {
    textAlign: "center",
    padding: 40,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    maxWidth: 400,
    margin: "80px auto",
  },
  errorTitle: {
    margin: "16px 0 24px",
    color: "#1f2937",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: 16,
    color: "#4b5563",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: 8,
    transition: "background 0.2s",
    ":hover": {
      background: "#f3f4f6",
    },
  },
  headerActions: {
    display: "flex",
    gap: 12,
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
    color: "#4b5563",
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      background: "#f9fafb",
      borderColor: "#d1d5db",
    },
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  content: {
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
    padding: 32,
  },
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  badgeGroup: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 30,
    fontSize: 14,
    fontWeight: 500,
  },
  hotelImage: {
    width: "100%",
    height: 280,
    objectFit: "cover",
    borderRadius: 16,
    marginBottom: 24,
  },
  card: {
    border: "1px solid #eef2f6",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    background: "#fff",
    transition: "box-shadow 0.2s",
    ":hover": {
      boxShadow: "0 8px 20px rgba(0,0,0,0.02)",
    },
  },
  hotelName: {
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 8px 0",
    color: "#111827",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#6b7280",
  },
  locationText: {
    fontSize: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: "0 0 20px 0",
    color: "#1f2937",
  },
  datesGrid: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  dateBlock: {
    flex: 1,
    minWidth: 200,
  },
  dateLabel: {
    display: "block",
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  dateValue: {
    display: "block",
    fontSize: 18,
    fontWeight: 500,
    color: "#111827",
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 13,
    color: "#9ca3af",
  },
  dateDivider: {
    fontSize: 20,
    color: "#9ca3af",
  },
  nightsBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    background: "#f3f4f6",
    borderRadius: 30,
    fontSize: 14,
    color: "#4b5563",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    color: "#4b5563",
    fontSize: 15,
  },
  divider: {
    height: 1,
    background: "#e5e7eb",
    margin: "12px 0",
  },
  totalRow: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
  },
  totalAmount: {
    color: "#059669",
    fontSize: 18,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px dashed #eef2f6",
    ":last-child": {
      borderBottom: "none",
    },
  },
  infoLabel: {
    color: "#6b7280",
    fontSize: 14,
  },
  infoValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: 500,
  },
  policyCard: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#9a3412",
    margin: "0 0 8px 0",
  },
  policyText: {
    fontSize: 14,
    color: "#7b341e",
    margin: 0,
    lineHeight: 1.5,
  },
  helpSection: {
    textAlign: "center",
    padding: 24,
    background: "#f8fafc",
    borderRadius: 16,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1f2937",
    margin: "0 0 16px 0",
  },
  helpButtons: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  helpButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 40,
    color: "#4b5563",
    textDecoration: "none",
    fontSize: 14,
    transition: "all 0.2s",
    ":hover": {
      background: "#f3f4f6",
      borderColor: "#d1d5db",
    },
  },
  actionButtons: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginTop: 16,
  },
  primaryButton: {
    padding: "14px 28px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 40,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
    ":hover": {
      background: "#2563eb",
    },
  },
  secondaryButton: {
    padding: "14px 28px",
    background: "#fff",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    borderRadius: 40,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      background: "#f9fafb",
      borderColor: "#d1d5db",
    },
  },
};

// Add keyframe animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length
);

export default BookingDetails;