import React from "react";

const BookingStats = ({ bookings }) => {
  const total = bookings.length;

  const spent = bookings.reduce(
    (sum, b) =>
      sum + (b.totalPrice || 0),
    0
  );

  return (
    <div className="stats-bar">
      <div>Total: {total}</div>
      <div>
        Spent: ₹{spent}
      </div>
    </div>
  );
};

export default BookingStats;