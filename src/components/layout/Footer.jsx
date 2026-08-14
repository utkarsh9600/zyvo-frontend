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

    setTimeout(() => setStatus(""), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-section">
          <h2 className="footer-logo">Zyvo Rooms</h2>
          <p className="footer-description">
            Discover premium hotels at unbeatable prices. Seamless booking,
            secure payments, and world-class comfort.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Get exclusive deals & travel updates</p>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="input-wrapper">
              <FiMail size={18} color="#94a3b8" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit">Subscribe</button>
          </form>

          {status && <p className="newsletter-message">{status}</p>}
        </div>
      </div>

      {/* Social Icons */}
      <div className="footer-social">
        <a href="#" aria-label="Facebook">
          <FiFacebook size={24} color="#cbd5e1" />
        </a>
        <a href="#" aria-label="Twitter">
          <FiTwitter size={24} color="#cbd5e1" />
        </a>
        <a href="#" aria-label="Instagram">
          <FiInstagram size={24} color="#cbd5e1" />
        </a>
        <a href="#" aria-label="LinkedIn">
          <FiLinkedin size={24} color="#cbd5e1" />
        </a>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Zyvo Rooms. All Rights Reserved.</p>

        <button onClick={scrollToTop} className="scroll-top">
          <FiChevronUp size={18} /> Back to Top
        </button>
      </div>
    </footer>
  );
};

export default Footer;