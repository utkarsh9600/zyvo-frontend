// Invoice.jsx – World‑class invoice component, 100x better than OYO, Iyi, and Goibibo
// Features: beautiful design, dark mode, print, share, loading skeleton, error handling, responsive

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiDownload,
  FiPrinter,
  FiShare2,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiMoon,
  FiSun
} from "react-icons/fi";
import { format } from "date-fns";

const API = import.meta.env.VITE_API_URL || "https://zyvo-backend-40dg.onrender.com";

// ----------------------------------------------------------------------
// Loading Skeleton
// ----------------------------------------------------------------------
const InvoiceSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Status Badge Component
// ----------------------------------------------------------------------
const StatusBadge = ({ status }) => {
  const config = {
    PAID: { icon: FiCheckCircle, text: "Paid", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    PENDING: { icon: FiClock, text: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    FAILED: { icon: FiXCircle, text: "Failed", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    REFUNDED: { icon: FiXCircle, text: "Refunded", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400" },
  };
  const { icon: Icon, text, color } = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon size={16} />
      {text}
    </span>
  );
};

// ----------------------------------------------------------------------
// Main Invoice Component
// ----------------------------------------------------------------------
const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");

  const fetchInvoice = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/api/bookings/${id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(res.data.invoice);
    } catch (err) {
      setError(err.response?.data?.message || "Invoice not available");
    } finally {
      setLoading(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice for Booking ${invoice?.bookingId}`,
          text: `Your invoice from Stayza`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <InvoiceSkeleton />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-lg">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchInvoice}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              title="Print"
            >
              <FiPrinter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              title="Share"
            >
              <FiShare2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <FiArrowLeft size={18} />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden print:shadow-none print:border-0">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiHome className="w-8 h-8" />
              <span className="text-2xl font-bold">Stayza</span>
            </div>
            <StatusBadge status={invoice.paymentStatus} />
          </div>

          {/* Invoice Details */}
          <div className="p-6 space-y-6">
            {/* Booking Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID</p>
                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">{invoice.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Date</p>
                <p className="text-lg text-gray-900 dark:text-white">{format(new Date(invoice.createdAt), "dd MMM yyyy")}</p>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hotel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FiHome className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.hotelName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.hotelAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white">{invoice.city}, {invoice.state}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check In</p>
                    <p className="font-medium text-gray-900 dark:text-white">{format(new Date(invoice.checkIn), "dd MMM yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check Out</p>
                    <p className="font-medium text-gray-900 dark:text-white">{format(new Date(invoice.checkOut), "dd MMM yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiHome className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nights</p>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.nights}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Room Charges ({invoice.nights} nights @ ₹{invoice.pricePerNight}/night)</span>
                  <span className="font-medium">₹{invoice.baseAmount.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Discount</span>
                    <span className="font-medium text-green-600">- ₹{invoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>GST (12%)</span>
                  <span className="font-medium">₹{invoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Service Fee</span>
                  <span className="font-medium">₹{invoice.serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Grand Total</span>
                  <span>₹{invoice.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Payment Status</span>
              <StatusBadge status={invoice.paymentStatus} />
            </div>

            {/* Footer Note */}
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              This is a system generated invoice. No signature required.
            </div>
          </div>
        </div>

        {/* Print-only header/footer (hidden on screen) */}
        <div className="hidden print:block print:mt-4 text-center text-sm text-gray-500">
          Thank you for choosing Stayza!
        </div>
      </div>
    </div>
  );
};

export default Invoice;