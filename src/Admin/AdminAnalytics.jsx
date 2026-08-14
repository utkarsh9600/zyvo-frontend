import React, { useEffect, useState } from "react";
import "./AdminAnalytics.css";

const API = "https://zyvo-backend-409g.onrender.com/api";

const AdminAnalytics = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    revenue: 0,
    bookings: 0,
    hotels: 0,
    users: 0,
    monthlyRevenue: [],
    bookingStatus: {},
    topHotels: [],
    recentBookings: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);

  if (loading) {
    return <div className="admin-loading">Loading Analytics...</div>;
  }

  return (
    <div className="admin-analytics">

      {/* ================= KPI CARDS ================= */}
      <div className="analytics-cards">

        <div className="analytics-card revenue">
          <h4>Total Revenue</h4>
          <h2>{formatCurrency(stats.revenue)}</h2>
        </div>

        <div className="analytics-card bookings">
          <h4>Total Bookings</h4>
          <h2>{stats.bookings}</h2>
        </div>

        <div className="analytics-card hotels">
          <h4>Total Hotels</h4>
          <h2>{stats.hotels}</h2>
        </div>

        <div className="analytics-card users">
          <h4>Total Users</h4>
          <h2>{stats.users}</h2>
        </div>

      </div>

      {/* ================= REVENUE TREND ================= */}
      <div className="analytics-section">
        <h3>Monthly Revenue</h3>

        <div className="bar-chart">
          {stats.monthlyRevenue.map((month, index) => (
            <div key={index} className="bar-item">
              <div
                className="bar"
                style={{ height: `${month.amount / 1000}px` }}
              ></div>
              <span>{month.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOOKING STATUS ================= */}
      <div className="analytics-section">
        <h3>Booking Status Breakdown</h3>

        <div className="status-grid">
          {Object.entries(stats.bookingStatus).map(([key, value]) => (
            <div key={key} className={`status-box ${key.toLowerCase()}`}>
              <h4>{key}</h4>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TOP HOTELS ================= */}
      <div className="analytics-section">
        <h3>Top Performing Hotels</h3>

        <div className="top-hotels">
          {stats.topHotels.map((hotel) => (
            <div key={hotel._id} className="top-hotel-card">
              <img
                src={hotel.image || "https://via.placeholder.com/80"}
                alt={hotel.name}
              />
              <div>
                <h4>{hotel.name}</h4>
                <p>{hotel.city}</p>
                <span>{formatCurrency(hotel.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RECENT BOOKINGS ================= */}
      <div className="analytics-section">
        <h3>Recent Bookings</h3>

        <table className="analytics-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Hotel</th>
              <th>User</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {stats.recentBookings.map((b) => (
              <tr key={b._id}>
                <td>{b._id.slice(-6)}</td>
                <td>{b.hotel?.name}</td>
                <td>{b.user?.email}</td>
                <td>
                  <span className={`badge ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </td>
                <td>{formatCurrency(b.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminAnalytics;