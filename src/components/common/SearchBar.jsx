import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";

/*
========================================================
Zyvo Rooms – PRODUCTION READY SEARCH BAR
========================================================
Features:
✔ Debounced Search
✔ City Suggestions
✔ Price Range Slider
✔ Keyboard Navigation
✔ Clear Filters
✔ Responsive
✔ Accessible
✔ Optimized
========================================================
*/

const DEFAULT_CITIES = [
  "Delhi",
  "Mumbai",
  "Ayodhya",
  "Lucknow",
  "Bangalore",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Jaipur",
  "Goa",
  "Varanasi",
  "Agra",
  "Pune",
];

const SearchBar = memo(
  ({
    city,
    setCity,
    maxPrice,
    setMaxPrice,
    onSearch,
    maxLimit = 20000,
  }) => {
    const [localCity, setLocalCity] = useState(city || "");
    const [localPrice, setLocalPrice] = useState(maxPrice || "");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const inputRef = useRef(null);
    const containerRef = useRef(null);

    /* ========================================
       Debounced Update
    ======================================== */
    useEffect(() => {
      const timer = setTimeout(() => {
        setCity(localCity);
      }, 400);

      return () => clearTimeout(timer);
    }, [localCity, setCity]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setMaxPrice(localPrice);
      }, 400);

      return () => clearTimeout(timer);
    }, [localPrice, setMaxPrice]);

    /* ========================================
       Suggestions Logic
    ======================================== */
    const filteredCities = useMemo(() => {
      if (!localCity) return DEFAULT_CITIES.slice(0, 6);

      return DEFAULT_CITIES.filter((c) =>
        c.toLowerCase().includes(localCity.toLowerCase())
      ).slice(0, 6);
    }, [localCity]);

    /* ========================================
       Outside Click Handler
    ======================================== */
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ========================================
       Keyboard Navigation
    ======================================== */
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;

      if (e.key === "ArrowDown") {
        setHighlightIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
      }

      if (e.key === "Enter" && highlightIndex >= 0) {
        setLocalCity(filteredCities[highlightIndex]);
        setShowSuggestions(false);
      }
    };

    /* ========================================
       Clear Filters
    ======================================== */
    const handleClear = useCallback(() => {
      setLocalCity("");
      setLocalPrice("");
      setCity("");
      setMaxPrice("");
    }, [setCity, setMaxPrice]);

    /* ========================================
       Submit Search
    ======================================== */
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSearch) {
        onSearch({
          city: localCity,
          maxPrice: localPrice,
        });
      }
    };

    return (
      <form
        className="searchbar"
        onSubmit={handleSubmit}
        ref={containerRef}
      >
        {/* City Input */}
        <div className="searchbar__group">
          <label htmlFor="city" className="searchbar__label">
            City
          </label>

          <input
            id="city"
            ref={inputRef}
            type="text"
            placeholder="Search city..."
            value={localCity}
            onChange={(e) => {
              setLocalCity(e.target.value);
              setShowSuggestions(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="searchbar__input"
            autoComplete="off"
          />

          {/* Suggestions */}
          {showSuggestions && filteredCities.length > 0 && (
            <ul className="searchbar__suggestions">
              {filteredCities.map((c, index) => (
                <li
                  key={c}
                  className={`searchbar__suggestion ${
                    index === highlightIndex ? "active" : ""
                  }`}
                  onClick={() => {
                    setLocalCity(c);
                    setShowSuggestions(false);
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Input */}
        <div className="searchbar__group">
          <label htmlFor="price" className="searchbar__label">
            Max Price
          </label>

          <input
            id="price"
            type="number"
            min="0"
            max={maxLimit}
            placeholder="₹5000"
            value={localPrice}
            onChange={(e) => setLocalPrice(e.target.value)}
            className="searchbar__input"
          />

          {/* Range Slider */}
          <input
            type="range"
            min="0"
            max={maxLimit}
            value={localPrice || 0}
            onChange={(e) => setLocalPrice(e.target.value)}
            className="searchbar__slider"
          />
        </div>

        {/* Buttons */}
        <div className="searchbar__actions">
          <button
            type="button"
            onClick={handleClear}
            className="searchbar__clear"
          >
            Clear
          </button>

          <button type="submit" className="searchbar__submit">
            Search
          </button>
        </div>
      </form>
    );
  }
);

SearchBar.displayName = "SearchBar";

SearchBar.propTypes = {
  city: PropTypes.string,
  setCity: PropTypes.func.isRequired,
  maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setMaxPrice: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  maxLimit: PropTypes.number,
};

export default SearchBar;