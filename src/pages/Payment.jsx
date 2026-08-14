import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely extract state with fallbacks
  const { bookingId, hotel, totalAmount } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Redirect if missing critical data
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!bookingId || !totalAmount) {
      navigate("/my-bookings");
    }
  }, [bookingId, totalAmount, token, navigate]);

  // Dynamically load Razorpay script (with cache)
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Prevent multiple clicks
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway. Please check your internet connection.");
      }

      // 2. Create order on backend
      const orderRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      // Handle HTTP errors
      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create payment order");
      }

      const orderData = await orderRes.json();
      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.message || "Invalid response from server");
      }

      // 3. Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Must be set in .env
        amount: orderData.order.amount,
        currency: "INR",
        name: "Zyvo Rooms",
        description: hotel?.name || "Hotel Booking",
        order_id: orderData.order.id,
        image: "https://your-logo-url.com/logo.png", // Optional
        handler: async function (response) {
          // Payment successful – verify on backend
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              navigate("/payment-success", { replace: true });
            } else {
              navigate("/payment-failed", { replace: true });
            }
          } catch (err) {
            console.error("Verification error:", err);
            navigate("/payment-failed", { replace: true });
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the payment modal – treat as failure
            navigate("/payment-failed", { replace: true });
          },
          // Optional: handle retry etc.
        },
        theme: {
          color: "#8B0000",
        },
        // Prefill customer info if available
        prefill: {
          name: hotel?.customerName || "",
          email: hotel?.customerEmail || "",
          contact: hotel?.customerPhone || "",
        },
        notes: {
          bookingId: bookingId,
        },
      };

      // 4. Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // Reset loading only after modal is opened (not immediately)
      // But we need to keep loading false after modal open? Actually, modal is async.
      // We'll set loading false right after opening, because user can now interact.
      setLoading(false);
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "24px", color: "#1e1e2f" }}>Complete Payment</h2>

      {/* Booking Summary */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "24px",
        }}
      >
        <p style={{ margin: "8px 0", fontSize: "16px" }}>
          <strong>Hotel:</strong> {hotel?.name || "—"}
        </p>
        <p style={{ margin: "8px 0", fontSize: "16px" }}>
          <strong>Booking ID:</strong> {bookingId || "—"}
        </p>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#8B0000",
          }}
        >
          Total: ₹{totalAmount?.toLocaleString("en-IN") || "0"}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            background: "#ffe6e6",
            color: "#b00020",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ffb3b3",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={loading || !bookingId || !totalAmount}
        style={{
          width: "100%",
          padding: "14px",
          background: loading || !bookingId || !totalAmount ? "#aaa" : "#8B0000",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading || !bookingId || !totalAmount ? "not-allowed" : "pointer",
          fontSize: "18px",
          fontWeight: "600",
          transition: "background 0.2s",
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ marginRight: "8px" }}>⏳</span> Processing...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>

      {/* Security badge */}
      <p style={{ textAlign: "center", marginTop: "20px", color: "#666", fontSize: "14px" }}>
        🔒 Secure payment powered by Razorpay
      </p>
    </div>
  );
}