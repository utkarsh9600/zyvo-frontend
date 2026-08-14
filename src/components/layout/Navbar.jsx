import React, { useState, useEffect, useRef, memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

/* ================= LOGO ================= */

const RoyalLogo = () => (
  <div className="navbar__royal-logo">
    <span className="navbar__crown">👑</span>
    <div className="navbar__brand-wrapper">
      <span className="navbar__brand">Zyvo</span>
      <span className="navbar__brand-accent">Rooms</span>
    </div>
  </div>
);

/* ================= NAVBAR ================= */

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  /* ===== Close Menu ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ===== Scroll Effect ===== */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/hotels?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setIsMenuOpen(false);
  };

  /* ===== Correct Routes (MATCH APP.JSX) ===== */
  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/hotels", label: "Hotels" },
    { to: "/my-bookings", label: "My Bookings" }, // ✅ FIXED
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header
      className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
    >
      <nav className="navbar__container" ref={menuRef}>
        
        {/* Logo */}
        <NavLink to="/" className="navbar__logo-link">
          <RoyalLogo />
        </NavLink>

        {/* Desktop Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <form className="navbar__search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder="Search hotels, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar__search-input"
          />
          <button type="submit" className="navbar__search-btn">
            🔍
          </button>
        </form>

        {/* Mobile Toggle */}
        <button
          className={`navbar__hamburger ${
            isMenuOpen ? "navbar__hamburger--open" : ""
          }`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div
          className={`navbar__mobile ${
            isMenuOpen ? "navbar__mobile--open" : ""
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__mobile-link ${
                  isActive ? "navbar__mobile-link--active" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;