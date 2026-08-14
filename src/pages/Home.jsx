import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HotelCard from "../components/hotels/HotelCard";
import "./Home.css";

/* ===============================
   WORLD-CLASS CONSTANTS – Unicorn Level
=============================== */

const HERO_IMAGE = "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2000";

const ANIMATED_STATS = [
  { value: "500", label: "Cities Covered", suffix: "+" },
  { value: "50000", label: "Happy Guests", suffix: "+" },
  { value: "10000", label: "Hotels Listed", suffix: "+" },
];

const WORLD_CLASS_FEATURES = [
  {
    icon: "⚡",
    title: "1-Click Booking",
    desc: "Lightning-fast payments. Instant confirmation.",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    icon: "❤️‍🔥",
    title: "Couple-Friendly",
    desc: "100% verified safe stays for romance.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "🏆",
    title: "Premium Verified",
    desc: "Handpicked luxury with trusted reviews.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: "🛡️",
    title: "24/7 Elite Support",
    desc: "VIP assistance. Always ready for you.",
    gradient: "from-indigo-500 to-violet-600",
  },
];

const DESTINATIONS = [
  "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", 
  "Manali", "Kerala", "Udaipur", "Hyderabad", "Chennai"
];

/* ===============================
   UNICORN-LEVEL HOME COMPONENT
=============================== */

const Home = () => {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [premiumHotels, setPremiumHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [statsAnimation, setStatsAnimation] = useState({ 
    cities: 0, guests: 0, hotels: 0 
  });
  const [showDestinations, setShowDestinations] = useState(false);

  /* ===============================
     WORLD-CLASS DATA FETCHING
  =============================== */

  useEffect(() => {
    const fetchWorldClassHotels = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://zyvo-backend-40dg.onrender.com/api/hotels?maxPrice=8000&featured=true");
        const hotels = res.data.hotels.slice(0, 8);
        setFeaturedHotels(hotels);
        setPremiumHotels(hotels.filter(h => h.rating >= 4.2));
      } catch (err) {
        console.error("Failed to fetch premium stays", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorldClassHotels();
  }, []);

  /* ===============================
     ANIMATED STATS COUNTER
  =============================== */

  useEffect(() => {
    const animateStats = () => {
      ANIMATED_STATS.forEach((stat, index) => {
        let start = 0;
        const end = parseInt(stat.value);
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / end));
        
        const timer = setInterval(() => {
          start += 1;
          if (index === 0) setStatsAnimation(prev => ({...prev, cities: start}));
          if (index === 1) setStatsAnimation(prev => ({...prev, guests: start}));
          if (index === 2) setStatsAnimation(prev => ({...prev, hotels: start}));
          
          if (start >= end) clearInterval(timer);
        }, stepTime);
      });
    };

    const timeout = setTimeout(animateStats, 1000);
    return () => clearTimeout(timeout);
  }, []);

  /* ===============================
     ULTRA-SMOOTH HANDLERS
  =============================== */

  const debouncedSearch = useCallback(
    debounce((city) => {
      if (city) {
        navigate(`/hotels?city=${encodeURIComponent(city)}`);
      }
    }, 300),
    [navigate]
  );

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    debouncedSearch(searchCity);
  }, [searchCity, debouncedSearch]);

  const handleQuickSearch = useCallback((city) => {
    setSearchCity(city);
    navigate(`/hotels?city=${encodeURIComponent(city)}`);
  }, [navigate]);

  /* ===============================
     DESTINATION SUGGESTIONS
  =============================== */

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter(dest => 
      dest.toLowerCase().includes(searchCity.toLowerCase())
    ).slice(0, 5);
  }, [searchCity]);

  /* ===============================
     WORLD-CLASS RENDER
  =============================== */

  return (
    <div className="home">
      {/* ===== HERO – UNICORN LEVEL ===== */}
      <section className="home__hero relative overflow-hidden" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="home__hero-overlay absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        
        <div className="home__hero-content relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center mb-12">
            <h1 className="home__hero-title text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6 leading-tight">
              Luxury Stays.
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                Unbeatable Prices.
              </span>
            </h1>
            <p className="home__hero-subtitle text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Discover India's best verified hotels with AI-powered recommendations and VIP service.
            </p>
          </div>

          {/* WORLD-CLASS SEARCH BAR */}
          <form className="home__search max-w-2xl mx-auto mb-12" onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="🏨 Where to? Mumbai, Goa, Delhi, Manali..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="home__search-input w-full px-6 py-5 text-xl border-0 rounded-2xl shadow-2xl focus:ring-4 focus:ring-blue-500/30 bg-white/95 backdrop-blur-xl"
                aria-label="Search premium stays"
              />
              {filteredDestinations.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl mt-2 py-2 z-20 border max-h-60 overflow-auto">
                  {filteredDestinations.map((city, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickSearch(city)}
                      className="w-full text-left px-6 py-3 hover:bg-blue-50 transition-all duration-200 hover:pl-8"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="home__search-btn w-full md:w-auto mt-4 px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 block mx-auto"
            >
              🚀 Find Perfect Stay
            </button>
          </form>

          {/* TRUST BADGES */}
          <div className="home__trust flex flex-wrap gap-6 justify-center text-sm md:text-base">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl">✨ 100% Verified</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl">🔒 Secure Payments</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl">⭐ VIP Support</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl">⚡ Instant Booking</span>
          </div>
        </div>

        {/* FLOATING ANIMATIONS */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-400/20 backdrop-blur-xl rounded-full animate-bounce slow"></div>
      </section>

      {/* ===== FEATURES – WORLD CLASS ===== */}
      <section className="home__features py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="home__section-title text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 mb-6">
              Why Zyvo Rooms?
            </h2>
            <p className="home__section-subtitle text-xl text-gray-600 max-w-2xl mx-auto">
              Luxury meets affordability. Engineered for the modern traveler.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORLD_CLASS_FEATURES.map((feature, index) => (
              <div 
                key={index} 
                className="home__feature-card group cursor-pointer p-8 rounded-3xl bg-white/70 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 hover:border-blue-200/50"
              >
                <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 ${feature.gradient}`}>
                  <span>{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED HOTELS – PREMIUM ===== */}
      <section className="home__featured py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="home__section-title text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-blue-800 bg-clip-text text-transparent mb-6">
              🔥 Top Premium Hotels
            </h2>
            <p className="home__section-subtitle text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked luxury stays with 4.5+ ratings
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="loading__spinner w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-8"></div>
              <p className="text-2xl text-gray-500 font-semibold">Loading premium stays...</p>
            </div>
          ) : (
            <>
              <div className="home__hotel-grid grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {premiumHotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} premium />
                ))}
              </div>
              {premiumHotels.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-500 mb-8">No premium hotels found</p>
                  <button 
                    onClick={() => navigate("/hotels")}
                    className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all"
                  >
                    Explore All Hotels
                  </button>
                </div>
              )}
            </>
          )}

          <div className="text-center">
            <button
              className="home__view-all-btn inline-flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-xl font-semibold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate("/hotels")}
            >
              🌟 View 10,000+ Hotels
            </button>
          </div>
        </div>
      </section>

      {/* ===== ANIMATED STATS – UNICORN STATUS ===== */}
      <section className="home__stats py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {ANIMATED_STATS.map((stat, index) => (
              <div key={index} className="home__stat-card">
                <h3 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                  {statsAnimation.cities >= parseInt(stat.value) && index === 0 ? (
                    "500+"
                  ) : statsAnimation.guests >= parseInt(stat.value) && index === 1 ? (
                    "50K+"
                  ) : statsAnimation.hotels >= parseInt(stat.value) && index === 2 ? (
                    "10K+"
                  ) : (
                    `${statsAnimation.cities || statsAnimation.guests || statsAnimation.hotels}+`
                  )}
                </h3>
                <p className="text-xl md:text-2xl text-white/90 font-semibold tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA – CONVERT NOW ===== */}
      <section className="home__cta py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="home__cta-content">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Ready For Luxury?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 50K+ travelers who upgraded their stays with Zyvo Rooms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/hotels")}
                className="px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
              >
                🚀 Book Now
              </button>
              <button 
                onClick={() => navigate("/premium")}
                className="px-12 py-6 border-2 border-white/50 bg-white/10 backdrop-blur-xl text-xl font-semibold rounded-3xl hover:bg-white/20 hover:border-white transition-all duration-300"
              >
                🌟 Explore Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WORLD-CLASS FOOTER ===== */}
      <footer className="home__footer bg-gradient-to-r from-gray-900 to-black py-12 border-t-8 border-gradient-to-r border-transparent from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/80">
          <p className="text-lg mb-2">© {new Date().getFullYear()} Zyvo Rooms – India's #1 Luxury Stay Platform</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mt-4">
            <span>🔒 Secure Payments</span>
            <span>✨ 100% Verified</span>
            <span>🏆 Trusted by 50K+</span>
            <span>⚡ Instant Booking</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// UTILITY: DEBOUNCE FUNCTION
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Home;