import React, { useState, useEffect, useRef, memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

/* ================= LOGO ================= */

const RoyalLogo = () => (
  <div className="navbar__royal-logo">
    <span className="navbar__crown" aria-hidden="true">
      👑
    </span>

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
  const mobileMenuId = "navbar-mobile-menu";

  const navigate = useNavigate();

  /* ===== Close Menu ===== */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ===== Toggle Menu ===== */

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /* ===== Search ===== */

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(
      `/hotels?search=${encodeURIComponent(searchQuery.trim())}`
    );

    setSearchQuery("");
    setIsMenuOpen(false);
  };

  /* ===== Correct Routes ===== */

  const navLinks = [
    {
      to: "/",
      label: "Home",
      end: true,
    },
    {
      to: "/hotels",
      label: "Hotels",
    },
    {
      to: "/my-bookings",
      label: "My Bookings",
    },
    {
      to: "/dashboard",
      label: "Dashboard",
    },
  ];

  return (
    <header
      className={`navbar ${
        isScrolled ? "navbar--scrolled" : ""
      }`}
    >
      <nav
        className="navbar__container"
        ref={menuRef}
        aria-label="Main navigation"
      >
        {/* ================= LOGO ================= */}

        <NavLink
          to="/"
          className="navbar__logo-link"
          aria-label="Zyvo Rooms home"
        >
          <RoyalLogo />
        </NavLink>

        {/* ================= DESKTOP LINKS ================= */}

        <div className="navbar__links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__link ${
                  isActive ? "navbar__link--active" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ================= SEARCH ================= */}

        <form
          className="navbar__search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <label
            htmlFor="navbar-search"
            className="sr-only"
          >
            Search hotels or cities
          </label>

          <input
            id="navbar-search"
            type="search"
            placeholder="Search hotels, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar__search-input"
            autoComplete="off"
          />

          <button
            type="submit"
            className="navbar__search-btn"
            aria-label="Search"
          >
            <span aria-hidden="true">🔍</span>
          </button>
        </form>

        {/* ================= MOBILE TOGGLE ================= */}

        <button
          type="button"
          className={`navbar__hamburger ${
            isMenuOpen
              ? "navbar__hamburger--open"
              : ""
          }`}
          onClick={toggleMenu}
          aria-label={
            isMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls={mobileMenuId}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        {/* ================= MOBILE MENU ================= */}

        <div
          id={mobileMenuId}
          className={`navbar__mobile ${
            isMenuOpen
              ? "navbar__mobile--open"
              : ""
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__mobile-link ${
                  isActive
                    ? "navbar__mobile-link--active"
                    : ""
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