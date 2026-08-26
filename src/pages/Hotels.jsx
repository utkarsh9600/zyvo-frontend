// Hotels.jsx – ZYVO ROYAL DARK UNICORN VERSION

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiFilter,
  FiX,
} from "react-icons/fi";
import "./Hotels.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://zyvo-backend-409g.onrender.com";

const PER_PAGE = 9;

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const loaderRef = useRef(null);

  /* =====================================================
     FETCH HOTELS
  ===================================================== */
  useEffect(() => {
    let mounted = true;

    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API}/api/hotels`);

        console.log("Hotels API Response:", res.data);

        if (!mounted) return;

        // Backend response:
        // {
        //   success: true,
        //   total: 5,
        //   hotels: [...]
        // }

        const hotelList = Array.isArray(res.data?.hotels)
          ? res.data.hotels
          : Array.isArray(res.data)
          ? res.data
          : [];

        setHotels(hotelList);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);

        if (mounted) {
          setHotels([]);
          setError(
            err?.response?.data?.message ||
              "Unable to load hotels. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHotels();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     FILTER + SORT
  ===================================================== */
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    const searchValue = search.trim().toLowerCase();
    const cityValue = city.trim().toLowerCase();

    // SEARCH HOTEL
    if (searchValue) {
      result = result.filter((hotel) => {
        const hotelName = (
          hotel?.name ||
          hotel?.hotelName ||
          hotel?.title ||
          ""
        ).toLowerCase();

        return hotelName.includes(searchValue);
      });
    }

    // CITY
    // Backend response has:
    // location: {
    //   city: "Ayodhya",
    //   area: "...",
    //   state: "Uttar Pradesh"
    // }

    if (cityValue) {
      result = result.filter((hotel) => {
        const hotelCity = (
          hotel?.location?.city ||
          hotel?.city ||
          ""
        ).toLowerCase();

        const hotelArea = (
          hotel?.location?.area ||
          ""
        ).toLowerCase();

        const hotelState = (
          hotel?.location?.state ||
          ""
        ).toLowerCase();

        return (
          hotelCity.includes(cityValue) ||
          hotelArea.includes(cityValue) ||
          hotelState.includes(cityValue)
        );
      });
    }

    // PRICE LOW TO HIGH
    if (sort === "low") {
      result.sort(
        (a, b) =>
          Number(a?.price || 0) - Number(b?.price || 0)
      );
    }

    // PRICE HIGH TO LOW
    if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b?.price || 0) - Number(a?.price || 0)
      );
    }

    // TOP RATED
    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b?.rating || 0) - Number(a?.rating || 0)
      );
    }

    return result;
  }, [hotels, search, city, sort]);

  /* =====================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ===================================================== */
  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [search, city, sort]);

  const visibleHotels = filteredHotels.slice(
    0,
    visibleCount
  );

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];

      if (
        target.isIntersecting &&
        visibleCount < filteredHotels.length
      ) {
        setVisibleCount((prev) => prev + PER_PAGE);
      }
    },
    [visibleCount, filteredHotels.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      handleObserver,
      {
        threshold: 0.1,
      }
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }

      observer.disconnect();
    };
  }, [handleObserver]);

  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) {
    return (
      <div className="dark-loading">
        <div className="dark-skeleton"></div>
        <div className="dark-skeleton"></div>
        <div className="dark-skeleton"></div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */
  if (error) {
    return (
      <div className="royal-page">
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "#fff",
          }}
        >
          <h2>Unable to Load Hotels</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="royal-page">

      {/* =================================================
          HERO
      ================================================= */}
      <div className="royal-hero">
        <h1>Discover Luxury Stays</h1>

        <p>
          Where Comfort Meets Royalty
        </p>
      </div>

      {/* =================================================
          FILTER BAR
      ================================================= */}
      <div className="royal-filter">

        {/* HOTEL SEARCH */}
        <div className="search-box">
          <FiSearch />

          <input
            type="text"
            placeholder="Search hotel..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* CITY SEARCH */}
        <div className="search-box">
          <FiMapPin />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
          />
        </div>

        {/* FILTER BUTTON */}
        <button
          type="button"
          className="filter-btn"
          onClick={() =>
            setShowFilters(true)
          }
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* =================================================
          FILTER DRAWER
      ================================================= */}
      <div
        className={`filter-drawer ${
          showFilters ? "open" : ""
        }`}
      >
        <div className="drawer-header">
          <h3>Advanced Filters</h3>

          <button
            type="button"
            onClick={() =>
              setShowFilters(false)
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            <FiX />
          </button>
        </div>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="recommended">
            Recommended
          </option>

          <option value="low">
            Price: Low to High
          </option>

          <option value="high">
            Price: High to Low
          </option>

          <option value="rating">
            Top Rated
          </option>
        </select>
      </div>

      {/* =================================================
          HOTEL GRID
      ================================================= */}
      <div className="royal-grid">

        {visibleHotels.length > 0 ? (
          visibleHotels.map((hotel) => {

            const hotelName =
              hotel?.name ||
              hotel?.hotelName ||
              hotel?.title ||
              "Luxury Hotel";

            const hotelCity =
              hotel?.location?.city ||
              hotel?.city ||
              "India";

            const hotelArea =
              hotel?.location?.area ||
              "";

            const hotelRating =
              hotel?.rating ??
              4.5;

            const hotelPrice =
              hotel?.price ||
              999;

            const hotelImage =
              hotel?.images?.[0] ||
              hotel?.image ||
              hotel?.photos?.[0] ||
              "https://via.placeholder.com/400x250";

            return (
              <Link
                key={
                  hotel?._id ||
                  hotel?.id ||
                  `${hotelName}-${hotelPrice}`
                }
                to={`/hotels/${
                  hotel?._id || hotel?.id
                }`}
                className="royal-card"
              >

                {/* IMAGE */}
                <div className="royal-image">

                  <img
                    src={hotelImage}
                    alt={hotelName}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x250";
                    }}
                  />

                  <div className="royal-price">
                    ₹{hotelPrice}
                  </div>

                </div>

                {/* BODY */}
                <div className="royal-body">

                  <h3>
                    {hotelName}
                  </h3>

                  <p>
                    <FiMapPin />
                    {hotelCity}
                    {hotelArea
                      ? `, ${hotelArea}`
                      : ""}
                  </p>

                  <div className="rating">
                    <FiStar />
                    {hotelRating}
                  </div>

                  <div className="royal-book-btn">
                    Book Royal Stay
                  </div>

                </div>

              </Link>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "70px 20px",
              color: "#fff",
            }}
          >
            <h2>No Hotels Found</h2>

            <p>
              Try another hotel name or city.
            </p>
          </div>
        )}

      </div>

      {/* =================================================
          INFINITE SCROLL LOADER
      ================================================= */}
      {visibleCount < filteredHotels.length && (
        <div
          ref={loaderRef}
          style={{
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#aaa" }}>
            Loading more hotels...
          </span>
        </div>
      )}

    </div>
  );
};

export default Hotels;