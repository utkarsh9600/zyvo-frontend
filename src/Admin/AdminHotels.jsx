import React, { useEffect, useState } from "react";
import "./AdminHotels.css";

const API = "https://zyvo-backend-40dg.onrender.com/api";

const AdminHotels = () => {
  const token = localStorage.getItem("token");

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    price: "",
    totalRooms: "",
    rating: "",
    coupleFriendly: false,
    image: ""
  });

  // ================= FETCH HOTELS =================
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch(`${API}/hotels`);
      const data = await res.json();
      setHotels(data.hotels || []);
      setFilteredHotels(data.hotels || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH + FILTER =================
  useEffect(() => {
    let list = [...hotels];

    if (search) {
      list = list.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cityFilter) {
      list = list.filter(h =>
        h.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    setFilteredHotels(list);
  }, [search, cityFilter, hotels]);

  // ================= FORM HANDLER =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const openAddForm = () => {
    setEditingHotel(null);
    setForm({
      name: "",
      city: "",
      address: "",
      price: "",
      totalRooms: "",
      rating: "",
      coupleFriendly: false,
      image: ""
    });
    setFormOpen(true);
  };

  const openEditForm = (hotel) => {
    setEditingHotel(hotel);
    setForm({ ...hotel });
    setFormOpen(true);
  };

  // ================= SAVE HOTEL =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingHotel ? "PUT" : "POST";
      const url = editingHotel
        ? `${API}/hotels/${editingHotel._id}`
        : `${API}/hotels`;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      setFormOpen(false);
      fetchHotels();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;

    try {
      await fetch(`${API}/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchHotels();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= TOGGLE AVAILABILITY =================
  const toggleAvailability = async (hotel) => {
    try {
      await fetch(`${API}/hotels/${hotel._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: !hotel.isAvailable
        })
      });

      fetchHotels();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-hotels">
      <div className="admin-header">
        <h2>Hotel Management</h2>
        <button className="primary-btn" onClick={openAddForm}>
          + Add Hotel
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="admin-filters">
        <input
          placeholder="Search hotel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>City</th>
                <th>Price</th>
                <th>Rooms</th>
                <th>Rating</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>
                    <img
                      src={hotel.image || "https://via.placeholder.com/80"}
                      alt={hotel.name}
                      className="hotel-thumb"
                    />
                  </td>
                  <td>{hotel.name}</td>
                  <td>{hotel.city}</td>
                  <td>₹{hotel.price}</td>
                  <td>{hotel.totalRooms}</td>
                  <td>{hotel.rating || 0} ⭐</td>
                  <td>
                    <span
                      className={
                        hotel.isAvailable ? "status active" : "status inactive"
                      }
                    >
                      {hotel.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => openEditForm(hotel)}>Edit</button>
                    <button onClick={() => handleDelete(hotel._id)}>
                      Delete
                    </button>
                    <button onClick={() => toggleAvailability(hotel)}>
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM MODAL */}
      {formOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingHotel ? "Edit Hotel" : "Add Hotel"}</h3>

            <form onSubmit={handleSubmit} className="admin-form">
              <input name="name" placeholder="Hotel Name" value={form.name} onChange={handleChange} required />
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
              <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input name="totalRooms" type="number" placeholder="Total Rooms" value={form.totalRooms} onChange={handleChange} />
              <input name="rating" type="number" placeholder="Rating" value={form.rating} onChange={handleChange} />
              <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />

              <label>
                <input
                  type="checkbox"
                  name="coupleFriendly"
                  checked={form.coupleFriendly}
                  onChange={handleChange}
                />
                Couple Friendly
              </label>

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHotels;