import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://zyvo-backend-409g.onrender.com/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ===============================
      FETCH BOOKINGS
  =============================== */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data.bookings || []);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ===============================
      UPDATE STATUS
  =============================== */
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/bookings/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch {
      alert("Status update failed");
    }
  };

  /* ===============================
      FILTER LOGIC
  =============================== */
  const filteredBookings = bookings.filter((b) => {
    if (filter === "CONFIRMED") return b.status === "CONFIRMED";
    if (filter === "CANCELLED") return b.status === "CANCELLED";
    if (filter === "PENDING") return b.status === "PENDING";
    return true;
  });

  /* ===============================
      UI STATES
  =============================== */
  if (loading) {
    return <h2 style={styles.center}>Loading bookings…</h2>;
  }

  if (error) {
    return <h3 style={{ ...styles.center, color: "red" }}>{error}</h3>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin – Bookings</h1>

      {/* FILTERS */}
      <div style={styles.filters}>
        {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((f) => (
          <button
            key={f}
            style={{
              ...styles.filterBtn,
              background: filter === f ? "#b11226" : "#eee",
              color: filter === f ? "#fff" : "#333",
            }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <p style={styles.center}>No bookings found</p>
      )}

      {/* BOOKINGS LIST */}
      {filteredBookings.map((b) => (
        <div key={b._id} style={styles.card}>
          <div style={styles.top}>
            <h3>{b.hotel?.name}</h3>

            <span
              style={{
                ...styles.badge,
                background:
                  b.status === "CONFIRMED"
                    ? "#1b5e20"
                    : b.status === "CANCELLED"
                    ? "#b71c1c"
                    : "#f57c00",
              }}
            >
              {b.status}
            </span>
          </div>

          <p>📍 {b.hotel?.city}</p>
          <p>👤 User: {b.user?.name || "N/A"}</p>

          <div style={styles.row}>
            <span>Check-in</span>
            <span>{new Date(b.checkIn).toDateString()}</span>
          </div>

          <div style={styles.row}>
            <span>Check-out</span>
            <span>{new Date(b.checkOut).toDateString()}</span>
          </div>

          <div style={styles.row}>
            <span>Total Price</span>
            <strong>₹ {b.totalPrice}</strong>
          </div>

          <div style={styles.meta}>
            <span>ID: {b._id.slice(-6)}</span>
            <span>
              {new Date(b.createdAt).toDateString()}
            </span>
          </div>

          {/* ACTIONS */}
          {b.status === "PENDING" && (
            <div style={styles.actions}>
              <button
                style={styles.confirmBtn}
                onClick={() =>
                  updateStatus(b._id, "CONFIRMED")
                }
              >
                Confirm
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() =>
                  updateStatus(b._id, "CANCELLED")
                }
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;

/* ===============================
      STYLES – OYO GRADE
=============================== */
const styles = {
  container: {
    padding: 20,
  },
  heading: {
    marginBottom: 20,
  },
  center: {
    textAlign: "center",
  },
  filters: {
    display: "flex",
    gap: 10,
    marginBottom: 25,
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "7px 14px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  meta: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
    display: "flex",
    justifyContent: "space-between",
  },
  actions: {
    marginTop: 15,
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },
  confirmBtn: {
    background: "#1b5e20",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
};