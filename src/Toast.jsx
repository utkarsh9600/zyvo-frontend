// Toast.jsx – World‑class toast notification, 100x better than OYO
// Features: auto‑dismiss, type‑based colors, close button, smooth animation, accessible

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Toast = ({ 
  message, 
  type = "info", 
  onClose, 
  duration = 3000,
  showCloseButton = true 
}) => {
  useEffect(() => {
    if (!message || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  // Type‑based styles
  const typeStyles = {
    success: "bg-green-600 dark:bg-green-700",
    error: "bg-red-600 dark:bg-red-700",
    info: "bg-blue-600 dark:bg-blue-700",
    warning: "bg-yellow-600 dark:bg-yellow-700",
  };

  const bgColor = typeStyles[type] || typeStyles.info;

  return (
    <div
      role="alert"
      className={`
        fixed top-4 right-4 z-50 
        flex items-center gap-3 
        px-4 py-3 rounded-lg shadow-lg 
        text-white 
        transition-all duration-300 ease-in-out
        animate-in fade-in slide-in-from-top-2
        ${bgColor}
      `}
      style={{ minWidth: "250px", maxWidth: "400px" }}
    >
      {/* Message */}
      <div className="flex-1 text-sm font-medium">{message}</div>

      {/* Close button */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition"
          aria-label="Close notification"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};
export default Toast;