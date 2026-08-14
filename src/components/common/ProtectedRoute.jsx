// ProtectedRoute.jsx – World‑class route protection, 100x better than OYO
// Features: token validation, role‑based access, redirect with state, loading state, and clean code

import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * ProtectedRoute component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component(s) to render if authorized
 * @param {string|string[]} props.allowedRoles - Single role or array of roles that can access
 * @param {boolean} props.redirectTo - Where to redirect if not authenticated (default: '/login')
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/login" 
}) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, true/false = decision
  const location = useLocation();

  useEffect(() => {
    // Simulate async check (e.g., token validation with backend)
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
          setIsAuthorized(false);
          return;
        }

        const user = JSON.parse(userStr);
        
        // If no specific roles required, just being logged in is enough
        if (!allowedRoles || allowedRoles.length === 0) {
          setIsAuthorized(true);
          return;
        }

        // Check if user role matches any allowed role
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (roles.includes(user.role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  // Show loading state (optional – you can replace with a spinner)
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authorized – redirect to login, but remember where they tried to go
  if (!isAuthorized) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Authorized – render children
  return <>{children}</>;
};

export default ProtectedRoute;