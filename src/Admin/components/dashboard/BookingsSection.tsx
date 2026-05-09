import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import styles from "./Styles/BookingsSection.module.css";
import React from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Booking {
  id: string;
  room_name: string;
  full_name: string;
  email: string;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status?: "paid" | "pending";
  guests?: number;
}

interface BookingsSectionProps {
  compact?: boolean;
}

function BookingsSection({ compact = false }: BookingsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking? This cannot be undone."
    );
    if (!confirmDelete) return;

    setDeleting(id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete booking`);
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      alert("Booking deleted successfully!");
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message || "Error deleting booking");
    } finally {
      setDeleting(null);
    }
  };

  const transformedBookings = bookings.map((b) => ({
    id: b.id,
    roomName: b.room_name ?? "",
    roomType: "Standard",
    guestName: b.full_name ?? "",
    guestEmail: b.email ?? "",
    checkIn: b.check_in,
    checkOut: b.check_out,
    paymentStatus: b.payment_status || "pending",
    guests: b.guests || 2,
    total: b.total_price,
  }));

  const query = searchQuery.toLowerCase();

  const filteredBookings = transformedBookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(query) ||
      booking.roomName.toLowerCase().includes(query) ||
      booking.id.toLowerCase().includes(query) ||
      booking.guestEmail.toLowerCase().includes(query) ||
      booking.paymentStatus.toLowerCase().includes(query);

    const matchesFilter =
      filterStatus === "all" || booking.paymentStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const displayedBookings = compact
    ? filteredBookings.slice(0, 5)
    : filteredBookings;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {compact ? "Recent Bookings" : "Bookings Management"}
        </h2>
      </div>

      {!compact && (
        <div className={styles.searchBar}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by guest name, room, booking ID, or email..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className={styles.filterButton}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      )}

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : displayedBookings.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.id}</strong>
                  </td>
                  <td>
                    <div className={styles.roomDetails}>
                      <h4>{booking.guestName}</h4>
                      <p>{booking.guestEmail}</p>
                    </div>
                  </td>
                  <td>
                    <div className={styles.roomDetails}>
                      <h4>{booking.roomName}</h4>
                      <p>{booking.roomType}</p>
                    </div>
                  </td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>
                    {formatDate(booking.checkOut)}
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        margin: "4px 0 0 0",
                      }}
                    >
                      {calculateNights(booking.checkIn, booking.checkOut)} nights
                    </p>
                  </td>
                  <td>
                    <strong>R {booking.total.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor:
                          booking.paymentStatus === "paid"
                            ? "#22c55e" // ✅ green for paid
                            : "#f87171", // ❌ red for pending
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={deleting === booking.id}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: deleting === booking.id ? 0.6 : 1,
                      }}
                    >
                      <Trash2 size={16} />
                      {deleting === booking.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Search size={64} />
          <h3>No bookings found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default BookingsSection;
