import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiChevronUp,
  FiMail,
} from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setStatus("Subscribed successfully!");
    setEmail("");

    setTimeout(() => {
      setStatus("");
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ================= BRAND ================= */}

        <div className="footer-section">
          <h2 className="footer-logo">Zyvo Rooms</h2>

          <p className="footer-description">
            Discover premium hotels at unbeatable prices. Seamless booking,
            secure payments, and world-class comfort.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/hotels">Hotels</Link>
            </li>

            <li>
              <Link to="/my-bookings">My Bookings</Link>
            </li>

            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* ================= SUPPORT ================= */}

        <div className="footer-section">
          <h3>Support</h3>

          <ul>
            <li>
              <Link to="/contact">Contact</Link>
            </li>

            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>

            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* ================= NEWSLETTER ================= */}

        <div className="footer-section">
          <h3>Newsletter</h3>

          <p>Get exclusive deals & travel updates</p>

          <form
            onSubmit={handleSubmit}
            className="newsletter-form"
          >
            <div className="input-wrapper">

              {/* Decorative icon */}
              <FiMail
                size={18}
                color="#94a3b8"
                aria-hidden="true"
              />

              {/* Screen-reader label */}
              <label
                htmlFor="newsletter-email"
                className="sr-only"
              >
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <button type="submit">
              Subscribe
            </button>
          </form>

          {/* Accessible status message */}
          {status && (
            <p
              className="newsletter-message"
              role="status"
              aria-live="polite"
            >
              {status}
            </p>
          )}
        </div>
      </div>

      {/* ================= SOCIAL ICONS ================= */}

      <div className="footer-social">

        <a
          href="#"
          aria-label="Facebook"
        >
          <FiFacebook
            size={24}
            color="#cbd5e1"
            aria-hidden="true"
          />
        </a>

        <a
          href="#"
          aria-label="Twitter"
        >
          <FiTwitter
            size={24}
            color="#cbd5e1"
            aria-hidden="true"
          />
        </a>

        <a
          href="#"
          aria-label="Instagram"
        >
          <FiInstagram
            size={24}
            color="#cbd5e1"
            aria-hidden="true"
          />
        </a>

        <a
          href="#"
          aria-label="LinkedIn"
        >
          <FiLinkedin
            size={24}
            color="#cbd5e1"
            aria-hidden="true"
          />
        </a>
      </div>

      {/* ================= BOTTOM ================= */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Zyvo Rooms.
          All Rights Reserved.
        </p>

        <button
          type="button"
          onClick={scrollToTop}
          className="scroll-top"
          aria-label="Back to top"
        >
          <FiChevronUp
            size={18}
            aria-hidden="true"
          />
          <span>Back to Top</span>
        </button>

      </div>
    </footer>
  );
};

export default Footer;