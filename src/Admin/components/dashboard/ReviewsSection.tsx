import { useState, useEffect } from "react";
import { Search, Star } from "lucide-react"; // removed Trash2
import styles from "./Reviews.module.css";
import React from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Review {
  id: string;
  name: string;
  rating: number;
  experience: string;
  room_id: number;
  created_at: string;
}

interface ReviewsSectionProps {
  compact?: boolean;
}

function ReviewsSection({ compact = false }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Review[] = await response.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredReviews = reviews.filter((review) => {
    if (!query) return true;
    return (
      review.name?.toLowerCase().includes(query) ||
      review.experience?.toLowerCase().includes(query) ||
      review.id?.toLowerCase().includes(query) ||
      review.room_id.toString().includes(query) ||
      review.rating.toString().includes(query)
    );
  });

  // Safe highlight function
  const highlightMatch = (text: string | null | undefined) => {
    if (!text) return "";
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : part
        )}
      </>
    );
  };

  const displayedReviews = compact ? filteredReviews.slice(0, 5) : filteredReviews;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {compact ? "Recent Reviews" : "Reviews Management"}
        </h2>
      </div>

      {!compact && (
        <div className={styles.searchBar}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by reviewer name, experience, rating, or room..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : displayedReviews.length > 0 ? (
        <div className={styles.reviewsTableWrapper}>
          <table className={styles.reviewsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Experience</th>
                <th>Room ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedReviews.map((review) => (
                <tr key={review.id}>
                  <td>{highlightMatch(review.id)}</td>
                  <td>{highlightMatch(review.name)}</td>
                  <td>
                    <span className={styles.rating}>
                      <Star size={16} color="#facc15" /> {review.rating}
                    </span>
                  </td>
                  <td>{highlightMatch(review.experience)}</td>
                  <td>{highlightMatch(String(review.room_id))}</td>
                  <td>{formatDate(review.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Search size={64} />
          <h3>No reviews found</h3>
          <p>Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;
