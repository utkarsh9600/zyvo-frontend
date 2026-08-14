import React from "react";

const BookingFilters = ({
  filter,
  setFilter,
  search,
  setSearch,
}) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search hotel..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
      >
        <option value="ALL">All</option>
        <option value="UPCOMING">
          Upcoming
        </option>
        <option value="PAST">Past</option>
        <option value="CANCELLED">
          Cancelled
        </option>
      </select>
    </div>
  );
};

export default BookingFilters;