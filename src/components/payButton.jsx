import React, { useState } from "react";
import axios from "axios";

const API = "https://zyvo-backend-40dg.onrender.com/api";

export default function PayButton({ bookingId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handlePayment = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1️⃣ Create Razorpay Order
      const { data } = await axios.post(
        `${API}/payments/create-order/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        throw new Error("Order creation failed");
      }

      // 2️⃣ Configure Razorpay
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Zyvo Rooms",
        description: "Hotel Booking Payment",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            // 3️⃣ Verify Payment
            await axios.post(
              `${API}/payments/verify`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("✅ Payment Successful");

            if (onSuccess) onSuccess();

          } catch (err) {
            alert("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: "Guest User",
        },

        theme: {
          color: "#facc15",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // 4️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("❌ Failed to create payment order");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        height: "42px",
        padding: "0 22px",
        borderRadius: "8px",
        fontWeight: "600",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        background: loading ? "#999" : "#facc15",
        color: "#111",
        transition: "0.2s",
      }}
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}