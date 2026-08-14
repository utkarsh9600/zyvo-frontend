// Hotels.jsx – ZYVO ROYAL DARK UNICORN VERSION

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiHeart,
  FiFilter,
  FiX,
} from "react-icons/fi";
import "./Hotels.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PER_PAGE = 9;

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const loaderRef = useRef(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${API}/api/hotels`);
        setHotels(res.data.hotels || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  /* ================= FILTER ================= */
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    if (search) {
      result = result.filter((h) =>
        h.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (city) {
      result = result.filter((h) =>
        h.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (sort === "low")
      result.sort((a, b) => (a.price || 0) - (b.price || 0));

    if (sort === "high")
      result.sort((a, b) => (b.price || 0) - (a.price || 0));

    if (sort === "rating")
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [hotels, search, city, sort]);

  const visibleHotels = filteredHotels.slice(0, visibleCount);

  /* ================= INFINITE SCROLL ================= */
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setVisibleCount((prev) => prev + PER_PAGE);
      }
    },
    []
  );

  useEffect(() => {
    const option = { threshold: 1 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
  }, [handleObserver]);

  if (loading) {
    return (
      <div className="dark-loading">
        <div className="dark-skeleton"></div>
        <div className="dark-skeleton"></div>
        <div className="dark-skeleton"></div>
      </div>
    );
  }

  return (
    <div className="royal-page">

      {/* HERO */}
      <div className="royal-hero">
        <h1>Discover Luxury Stays</h1>
        <p>Where Comfort Meets Royalty</p>
      </div>

      {/* FILTER BAR */}
      <div className="royal-filter">

        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-box">
          <FiMapPin />
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <button
          className="filter-btn"
          onClick={() => setShowFilters(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* SLIDE FILTER DRAWER */}
      <div className={`filter-drawer ${showFilters ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Advanced Filters</h3>
          <FiX onClick={() => setShowFilters(false)} />
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recommended">Recommended</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* GRID */}
      <div className="royal-grid">
        {visibleHotels.map((hotel) => (
          <Link
            key={hotel._id}
            to={`/hotels/${hotel._id}`}
            className="royal-card"
          >
            <div className="royal-image">
              <img
                src={
                  hotel.images?.[0] ||
                  "https://via.placeholder.com/400x250"
                }
                alt={hotel.name}
              />
              <div className="royal-price">
                ₹{hotel.price || 999}
              </div>
            </div>

            <div className="royal-body">
              <h3>{hotel.name}</h3>
              <p>{hotel.city}</p>
              <div className="rating">
                <FiStar />
                {hotel.rating || 4.5}
              </div>
              <button>Book Royal Stay</button>
            </div>
          </Link>
        ))}
      </div>

      <div ref={loaderRef} style={{ height: "40px" }}></div>
    </div>
  );
};

export default Hotels;