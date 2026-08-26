import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const DESTINATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Goa",
  "Jaipur",
  "Manali",
  "Kerala",
  "Udaipur",
];

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  const searchHotels = (e) => {
    e.preventDefault();

    navigate(
      city.trim()
        ? `/hotels?city=${encodeURIComponent(city.trim())}`
        : "/hotels"
    );
  };

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <span className="home__badge">
            ✦ Premium stays across India
          </span>

          <h1 className="home__hero-title">
            Find Your Perfect Stay.
            <span>Travel Better.</span>
          </h1>

          <p className="home__hero-subtitle">
            Discover comfortable, verified and premium
            hotels at great prices — all in one place.
          </p>

          <form
            className="home__search"
            onSubmit={searchHotels}
          >
            <div className="home__search-box">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where do you want to stay?"
                list="destinations"
              />

              <datalist id="destinations">
                {DESTINATIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              <button type="submit">
                Search Hotels
              </button>
            </div>
          </form>

          <div className="home__trust">
            <span>✓ Verified Properties</span>
            <span>✓ Secure Payments</span>
            <span>✓ Instant Confirmation</span>
            <span>✓ Easy Booking</span>
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="home__container">
          <h2>Everything you need for a better stay</h2>

          <div className="home__feature-grid">
            <article>
              <h3>⚡ Instant Booking</h3>
              <p>Book your stay quickly and easily.</p>
            </article>

            <article>
              <h3>🛡️ Verified Stays</h3>
              <p>Discover trusted properties.</p>
            </article>

            <article>
              <h3>💎 Premium Experience</h3>
              <p>Find highly-rated stays.</p>
            </article>

            <article>
              <h3>🎧 24/7 Support</h3>
              <p>Get help whenever you need it.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home__stats">
        <div className="home__stats-grid">
          <div>
            <strong>500+</strong>
            <span>Cities Covered</span>
          </div>

          <div>
            <strong>50K+</strong>
            <span>Happy Guests</span>
          </div>

          <div>
            <strong>10K+</strong>
            <span>Hotels Listed</span>
          </div>
        </div>
      </section>

      <section className="home__cta">
        <h2>Ready to find your perfect hotel?</h2>

        <button onClick={() => navigate("/hotels")}>
          Explore Hotels
        </button>
      </section>
    </main>
  );
};

export default Home;