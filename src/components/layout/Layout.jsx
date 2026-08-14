import React, { useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* =========================================================
   Error Boundary (Production Safe)
========================================================= */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Layout Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   Scroll To Top on Route Change
========================================================= */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

/* =========================================================
   Layout Component
========================================================= */

const Layout = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <ScrollToTop />

      <div className="layout">
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main key={location.pathname} className="layout__main">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

/* =========================================================
   Loader Component
========================================================= */

const PageLoader = () => {
  return (
    <div className="layout__loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

/* =========================================================
   Inline fallback styles (Safe mode)
========================================================= */

const styles = {
  errorContainer: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    fontFamily: "sans-serif",
  },
};

export default Layout;