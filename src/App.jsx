import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* LAYOUT */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

/* PAGES - LAZY LOADED */
const Home = lazy(() => import("./pages/Home"));
const Hotels = lazy(() => import("./pages/Hotels"));
const HotelDetails = lazy(() => import("./pages/HotelDetails"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const MyBookings = lazy(() => import("./pages/MyBookings"));
const BookingDetails = lazy(() => import("./pages/BookingDetails"));

const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

const NotFound = lazy(() => import("./pages/NotFound"));

/* ================================
   LOADING COMPONENT
================================ */

const PageLoader = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Loading...
  </div>
);

/* ================================
   AUTH PROTECTION
================================ */

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/* ================================
   MAIN APP
================================ */

function App() {
  return (
    <Router>
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/hotels" element={<Hotels />} />

          <Route path="/hotels/:id" element={<HotelDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            path="/my-bookings"
            element={
              <RequireAuth>
                <MyBookings />
              </RequireAuth>
            }
          />

          <Route
            path="/booking/:id"
            element={
              <RequireAuth>
                <BookingDetails />
              </RequireAuth>
            }
          />

          <Route
            path="/payment"
            element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            }
          />

          <Route
            path="/payment-success"
            element={
              <RequireAuth>
                <PaymentSuccess />
              </RequireAuth>
            }
          />

          <Route
            path="/payment-failed"
            element={
              <RequireAuth>
                <PaymentFailed />
              </RequireAuth>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* ================= 404 ================= */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;