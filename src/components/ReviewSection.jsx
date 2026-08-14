import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Send, AlertCircle, CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "https://zyvo-backend-409g.onrender.com";

/* ==========================================================
   STAR RATING COMPONENT
========================================================== */

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          <Star
            size={22}
            className={`${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            } ${readonly ? "cursor-default" : "cursor-pointer"}`}
          />
        </button>
      ))}
    </div>
  );
};

/* ==========================================================
   REVIEW CARD
========================================================== */

const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN");

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {review.user?.name || "Guest"}
          </p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>

        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {review.comment && (
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          {review.comment}
        </p>
      )}
    </div>
  );
};

/* ==========================================================
   MAIN REVIEW SECTION
========================================================== */

const ReviewSection = ({ hotelId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/reviews/${hotelId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) fetchReviews();
  }, [hotelId]);

  /* ================= CALCULATE AVERAGE ================= */

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  /* ================= SUBMIT REVIEW ================= */

  const submitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      setSubmitMsg("Please login to review.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMsg(null);

      const res = await axios.post(
        `${API}/api/reviews`,
        {
          bookingId: null, // Replace if using booking validation
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistic update
      setReviews((prev) => [res.data.review, ...prev]);

      setComment("");
      setRating(5);
      setSubmitMsg("Review submitted successfully!");
    } catch (err) {
      setSubmitMsg(
        err.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="mt-10 space-y-6">

      <h3 className="text-2xl font-bold">
        Guest Reviews ({reviews.length})
      </h3>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{averageRating}</div>
            <div>
              <StarRating value={Number(averageRating)} readonly />
              <p className="text-sm text-gray-500">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {/* Review Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Write a Review</h4>

        <form onSubmit={submitReview} className="space-y-4">
          <StarRating value={rating} onChange={setRating} />

          <div>
            <textarea
              rows="4"
              maxLength="500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full border rounded-lg p-3 dark:bg-gray-700"
            />
            <p className="text-xs text-right text-gray-400">
              {comment.length}/500
            </p>
          </div>

          {submitMsg && (
            <div className="text-sm text-blue-600">
              {submitMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
