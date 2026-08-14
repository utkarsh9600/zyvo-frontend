import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (form.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: form.name,
          email: form.email,
          isLoggedIn: true,
        })
      );

      setLoading(false);
      navigate("/");
    }, 1200);
  };

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__card">
          <h2 className="register__title">Create Your Royal Account 👑</h2>
          <p className="register__subtitle">
            Join Stayza & unlock premium stays
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="register__field">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="register__error">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="register__field">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="register__error">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="register__field">
              <div className="register__password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="register__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="register__error">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="register__field">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="register__error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="register__button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <p className="register__login-text">
            Already have an account?{" "}
            <Link to="/login" className="register__login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;