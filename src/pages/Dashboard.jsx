import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Hotel,
  Calendar,
  IndianRupee,
  TrendingUp,
  Loader2,
  ArrowRight,
} from "lucide-react";
import "./Dashboard.css";

const API = "https://zyvo-backend-409g.onrender.com";

/* ================= UTILITIES ================= */

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

/* ================= COMPONENT ================= */

const Dashboard = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const bookingReq = axios.get(
          `${API}/api/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const hotelReq = axios.get(
          `${API}/api/hotels`
        );

        const [bookingRes, hotelRes] =
          await Promise.all([
            bookingReq,
            hotelReq,
          ]);

        setBookings(
          bookingRes.data?.bookings || []
        );
        setHotels(
          hotelRes.data?.hotels || []
        );
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= STATS ================= */

  const stats = useMemo(() => {
    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (sum, b) => {
        const isPaid =
          b.payment?.status === "PAID";

        const amount =
          b.pricing?.finalAmount ||
          b.totalPrice ||
          0;

        return isPaid
          ? sum + amount
          : sum;
      },
      0
    );

    const upcoming = bookings.filter(
      (b) =>
        b.status === "CONFIRMED" &&
        new Date(b.checkIn) >
          new Date()
    ).length;

    return {
      totalBookings,
      totalRevenue,
      upcoming,
    };
  }, [bookings]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="dashboard-center">
        <Loader2 className="spin" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>👑 Zyvo Dashboard</h1>
        <p>
          Your complete booking overview
        </p>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">

        <div className="stat-card">
          <Hotel size={28} />
          <div>
            <h2>
              {stats.totalBookings}
            </h2>
            <span>
              Total Bookings
            </span>
          </div>
        </div>

        <div className="stat-card">
          <IndianRupee size={28} />
          <div>
            <h2>
              {formatCurrency(
                stats.totalRevenue
              )}
            </h2>
            <span>
              Total Revenue
            </span>
          </div>
        </div>

        <div className="stat-card">
          <Calendar size={28} />
          <div>
            <h2>
              {stats.upcoming}
            </h2>
            <span>
              Upcoming Stays
            </span>
          </div>
        </div>

        <div className="stat-card">
          <TrendingUp size={28} />
          <div>
            <h2>
              {hotels.length}
            </h2>
            <span>
              Listed Hotels
            </span>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">

        <button
          onClick={() =>
            navigate("/hotels")
          }
        >
          Explore Hotels
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() =>
            navigate("/my-bookings")
          }
        >
          My Bookings
          <ArrowRight size={16} />
        </button>

      </div>

      {/* RECENT BOOKINGS */}
      <div className="recent-card">
        <h2>Recent Bookings</h2>

        {bookings.length === 0 && (
          <p>
            No bookings yet.
          </p>
        )}

        {bookings
          .slice(0, 5)
          .map((booking) => (
            <div
              key={booking._id}
              className="recent-item"
              onClick={() =>
                navigate(
                  `/bookings/${booking._id}`
                )
              }
            >
              <div>
                <strong>
                  {
                    booking.hotel
                      ?.name
                  }
                </strong>
                <p>
                  {new Date(
                    booking.checkIn
                  ).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`status ${booking.payment?.status}`}
              >
                {booking.payment
                  ?.status ||
                  "PENDING"}
              </span>
            </div>
          ))}
      </div>

    </div>
  );
};

export default Dashboard;