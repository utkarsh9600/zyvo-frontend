import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const defaultUser = {
  name: "Utkarsh Pandey",
  email: "utkarsh@example.com",
  phone: "+91 8869978584",
  avatar: "https://i.pravatar.cc/150?img=12",
  tier: "Gold",
  totalBookings: 13,
  completedStays: 8,
  upcomingStays: 3,
  cancelled: 2,
  joined: "January 2025",
};

const Profile = memo(() => {
  const navigate = useNavigate();
  const [user, setUser] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultUser);

  // Load user from localStorage if exists
  useEffect(() => {
    const savedUser = localStorage.getItem("stayzaUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setFormData(parsed);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stayzaUser");
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    setUser(formData);
    localStorage.setItem("stayzaUser", JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <div className="profile__container">
        {/* Header */}
        <div className="profile__header">
          <h1>👑 My Profile</h1>
          <button className="profile__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="profile__card">
          <div className="profile__left">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile__avatar"
            />
            <h2>{user.name}</h2>
            <span className="profile__tier">{user.tier} Member</span>
            <p className="profile__joined">Joined {user.joined}</p>
          </div>

          <div className="profile__right">
            {!isEditing ? (
              <>
                <div className="profile__info">
                  <div>
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <label>Phone</label>
                    <p>{user.phone}</p>
                  </div>
                </div>

                <button
                  className="profile__edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="profile__form">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                </div>

                <div className="profile__actions">
                  <button className="save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile__stats">
          <div className="stat">
            <h3>{user.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat">
            <h3>{user.completedStays}</h3>
            <p>Completed</p>
          </div>
          <div className="stat">
            <h3>{user.upcomingStays}</h3>
            <p>Upcoming</p>
          </div>
          <div className="stat">
            <h3>{user.cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>

        {/* Membership Section */}
        <div className="profile__membership">
          <h2>✨ Membership Benefits</h2>
          <ul>
            <li>Priority Customer Support</li>
            <li>Exclusive Member Discounts</li>
            <li>Early Access to Deals</li>
            <li>Free Room Upgrades (subject to availability)</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

Profile.displayName = "Profile";

export default Profile;