import React, { useState, useEffect } from "react";
import {
  User,
  Upload,
  Edit,
  Info,
  LogOut,
  Loader,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  Bell,
} from "lucide-react";
import { BookingCard } from "./BookingCard/BookingCard";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";

type TabView = "history" | "new" | "favourites" | "settings" | "reservations";

interface Booking {
  id: number;
  room_id?: number;
  room_name: string;
  full_name?: string;
  phone?: string;
  email?: string;
  check_in: string;
  check_out: string;
  total_price: number;
  nights?: number;
  status: "upcoming" | "completed" | "cancelled";
  payment_status: "paid" | "pending" | "unpaid";
  room_image?: string;
}

interface Reservation {
  remainingMs: number;
  isExpired: any;
  reservation_id?: number;
  full_name: string;
  email: string;
  room_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status?: string;
  created_at?: string;
  expires_at?: string;
}

interface NotificationItem {
  id: number;
  message: string;
  type: string;
  date: string;
  booking?: Booking;
}

export default function Profile() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);

  const { user, logout, updateProfile } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [currentTab, setCurrentTab] = useState<TabView>("history");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const storageKey = user?.email ? `notifications_${user.email}` : null;
  const seenBookingsKey = user?.email ? `seenBookings_${user.email}` : null;
  const favoritesKey = user?.email ? `favorites_${user.email}` : null;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://tango-hotel-backend.onrender.com/api/users/${user.id}`
        );
        const data = await res.json();
        setProfileImage(data.user.profile_image);
        setCoverImage(data.user.cover_image);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [user?.id]);

  useEffect(() => {
    if (user?.email) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        contact: user.contact || "",
      });

      try {
        const raw = localStorage.getItem(`notifications_${user.email}`);
        setNotifications(raw ? JSON.parse(raw) : []);
      } catch {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
      setProfileImage(null);
      setCoverImage(null);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch {}
  }, [notifications, storageKey]);

  const addNotification = (
    message: string,
    type: string = "info",
    booking?: Booking
  ) => {
    if (!user?.email) return;
    const newNotif: NotificationItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      message,
      type,
      date: new Date().toISOString(),
      booking,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (storageKey) localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user?.email) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://tango-hotel-backend.onrender.com/api/bookings/user/${encodeURIComponent(
            user.email
          )}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const now = new Date();
          const enriched: Booking[] = data.map((b: any) => {
            const checkOut = new Date(b.check_out);
            const derivedStatus: "upcoming" | "completed" | "cancelled" =
              b.status === "cancelled" || b.payment_status === "cancelled"
                ? "cancelled"
                : checkOut >= now
                ? "upcoming"
                : "completed";

            return {
              ...b,
              status: derivedStatus,
              payment_status:
                b.payment_status === "paid"
                  ? "paid"
                  : b.payment_status || "pending",
              room_image:
                b.room_image ||
                "https://via.placeholder.com/400x250?text=No+Image",
            };
          });

          const seenRaw = seenBookingsKey
            ? localStorage.getItem(seenBookingsKey)
            : null;
          const seen = seenRaw
            ? new Set(JSON.parse(seenRaw))
            : new Set<string>();

          const newOnes = enriched.filter((b) => !seen.has(String(b.id)));
          if (newOnes.length > 0) {
            newOnes.forEach((booking) => {
              addNotification("You have a new booking.", "booking", booking);
              seen.add(String(booking.id));
            });
            if (seenBookingsKey)
              localStorage.setItem(seenBookingsKey, JSON.stringify([...seen]));
          }

          setBookings(enriched);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookings();

    const handleNewBooking = () => {
      fetchUserBookings();
    };

    window.addEventListener("newBooking", handleNewBooking);
    return () => window.removeEventListener("newBooking", handleNewBooking);
  }, [user?.email]);

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;

      setProfileImage(imageData);

      try {
        await fetch(
          "https://tango-hotel-backend.onrender.com/api/users/profile-image",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              profileImage: imageData,
            }),
          }
        );
      } catch (err) {
        console.error("Error updating profile image:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;

      setCoverImage(imageData);

      try {
        await fetch(
          "https://tango-hotel-backend.onrender.com/api/users/cover-image",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, coverImage: imageData }),
          }
        );
      } catch (err) {
        console.error("Error updating cover image:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (user?.email) {
        localStorage.setItem(`profileImage_${user.email}`, profileImage || "");
        localStorage.setItem(`coverImage_${user.email}`, coverImage || "");
      }

      await updateProfile({ ...formData, profileImage, coverImage });
      setSuccessMessage("Profile updated successfully");
      addNotification("Profile information updated successfully.", "profile");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFavorite = (bookingId: string) => {
    if (!user?.email || !favoritesKey) return;

    try {
      const raw = localStorage.getItem(favoritesKey);
      const favorites = raw
        ? new Set<string>(JSON.parse(raw))
        : new Set<string>();

      if (favorites.has(bookingId)) {
        favorites.delete(bookingId);
        addNotification("Removed from favorites.", "favorite");
      } else {
        favorites.add(bookingId);
        addNotification("Added to favorites.", "favorite");
      }

      localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
      setBookings([...bookings]);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (bookingId: string): boolean => {
    if (!user?.email || !favoritesKey) return false;
    try {
      const raw = localStorage.getItem(favoritesKey);
      const favorites = raw
        ? new Set<string>(JSON.parse(raw))
        : new Set<string>();
      return favorites.has(bookingId);
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    if (user?.email) {
      localStorage.removeItem(`profileImage_${user.email}`);
      localStorage.removeItem(`coverImage_${user.email}`);
      localStorage.removeItem(`notifications_${user.email}`);
      localStorage.removeItem(`seenBookings_${user.email}`);
    }
    setProfileImage(null);
    setCoverImage(null);
    setNotifications([]);
    logout();
  };

  const getTabBookings = () => {
    switch (currentTab) {
      case "new":
        return bookings.filter(
          (b) => b.status === "upcoming" || b.status === "cancelled"
        );
      case "favourites":
        if (!favoritesKey) return [];
        try {
          const raw = localStorage.getItem(favoritesKey);
          const favoriteIds = raw
            ? new Set<string>(JSON.parse(raw))
            : new Set<string>();
          return bookings.filter((b) => favoriteIds.has(String(b.id)));
        } catch {
          return [];
        }
      default:
        return bookings.filter((b) => b.status === "completed");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "booking":
        return <Calendar size={16} />;
      case "profile":
        return <User size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "booking":
        return styles.typeBadgeBooking;
      case "profile":
        return styles.typeBadgeProfile;
      case "favorite":
        return styles.typeBadgeFavorite;
      default:
        return styles.typeBadgeInfo;
    }
  };

  const tabBookings = getTabBookings();
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  const getFavoritesCount = () => {
    if (!favoritesKey) return 0;
    try {
      const raw = localStorage.getItem(favoritesKey);
      const favorites = raw ? JSON.parse(raw) : [];
      return favorites.length;
    } catch {
      return 0;
    }
  };

  const handleCancelBooking = async (id: string) => {
    const now = new Date();

    const cancelledBooking = bookings.find((b) => b.id.toString() === id);
    if (!cancelledBooking) return;

    const previousStatus = cancelledBooking.status;

    setBookings((prev) =>
      prev.map((b) =>
        b.id.toString() === id ? { ...b, status: "cancelled" as const } : b
      )
    );

    try {
      const res = await fetch(
        `https://tango-hotel-backend.onrender.com/api/bookings/${encodeURIComponent(
          id
        )}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error(`Cancel request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Booking cancelled successfully:", data);

      const updatedBooking = {
        ...cancelledBooking,
        status: data.booking?.payment_status || "cancelled",
        payment_status: data.booking?.payment_status || "cancelled",
      };

      setBookings((prev) =>
        prev.map((b) => (b.id.toString() === id ? updatedBooking : b))
      );

      const notification: NotificationItem = {
        id: now.getTime(),
        message: "Booking cancelled successfully!",
        type: "success",
        date: now.toISOString(),
        booking: updatedBooking,
      };

      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 3000);
    } catch (error) {
      console.error("Error cancelling booking:", error);

      setBookings((prev) =>
        prev.map((b) =>
          b.id.toString() === id ? { ...b, status: previousStatus } : b
        )
      );

      const notification: NotificationItem = {
        id: now.getTime(),
        message: "Failed to cancel booking. Please try again.",
        type: "error",
        date: now.toISOString(),
        booking: cancelledBooking,
      };

      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 3000);
    }
  };

  const handlePayNow = (booking: Booking) => {
    if (
      !booking ||
      booking.payment_status === "paid" ||
      booking.status === "cancelled"
    ) {
      alert("This booking is already paid, cancelled, or invalid.");
      return;
    }

    navigate(`/checkout/${booking.id}`);
  };

  const useCountdown = (initialMs: number) => {
    const [timeLeft, setTimeLeft] = useState(initialMs);

    useEffect(() => {
      if (timeLeft <= 0) return;

      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    };

    return formatTime(timeLeft);
  };

  const handleDeleteBooking = async (id: string) => {
    const booking = bookings.find((b) => b.id.toString() === id);
    if (!booking) return;

    if (booking.status !== "cancelled") {
      alert("Only cancelled bookings can be deleted.");
      return;
    }

    if (!confirm("Are you sure you want to permanently delete this booking?"))
      return;

    try {
      const res = await fetch(
        `https://tango-hotel-backend.onrender.com/api/bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b.id.toString() !== id));
      addNotification("Cancelled booking deleted successfully.", "booking");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchReservations = async () => {
      setIsLoadingReservations(true);
      try {
        const res = await fetch(
          `https://tango-hotel-backend.onrender.com/api/reservations/user/${encodeURIComponent(
            user.email
          )}`
        );
        const data: Reservation[] = await res.json();

        const now = new Date();
        const enriched = data.map((r) => {
          const createdAt = new Date(r.created_at ?? Date.now());
          const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000);
          const remainingMs = expiresAt.getTime() - now.getTime();
          return {
            ...r,
            expiresAt,
            remainingMs: remainingMs > 0 ? remainingMs : 0,
            isExpired: remainingMs <= 0,
          };
        });

        setReservations(enriched);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setReservations([]);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    fetchReservations();
  }, [user?.email]);

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this reservation?"))
      return;

    try {
      const res = await fetch(
        `https://tango-hotel-backend.onrender.com/api/reservations/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setReservations((prev) => prev.filter((r) => r.reservation_id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete reservation.");
    }
  };

  return (
    <div
      className={`${styles.profileContainer} ${isDarkMode ? styles.dark : ""}`}
    >
      <div className={styles.profileWrapper}>
        <div className={styles.coverSection}>
          <div
            className={styles.coverImage}
            style={{
              backgroundImage: coverImage
                ? `url(${coverImage})`
                : "linear-gradient(135deg, #07070a6c 0%, #19112069 100%), url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            }}
          >
            <label className={styles.uploadButton}>
              <Upload size={20} />
              <span>Upload Cover Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className={styles.profileInfoSection}>
            <div className={styles.profileLeft}>
              <div className={styles.avatarWrapper}>
                <label className={styles.avatarLabel}>
                  <div
                    className={styles.avatar}
                    style={{
                      backgroundImage: profileImage
                        ? `url(${profileImage})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!profileImage && <User size={64} />}
                  </div>
                  <div className={styles.avatarUploadHint}>
                    <Upload size={16} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <div className={styles.userDetails}>
                <div className={styles.nameRow}>
                  <h1 className={styles.userName}>
                    {formData.firstname} {formData.lastname}
                  </h1>
                  <button
                    className={styles.editButton}
                    onClick={() => setCurrentTab("settings")}
                  >
                    {/* <Edit size={16} /> */}
                  </button>
                </div>
                <div className={styles.locationRow}>
                  <span className={styles.locationText}>
                    {formData.contact || "Location not set"}
                  </span>
                </div>
              </div>
            </div>

            <button className={styles.moreButton} onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <nav className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                currentTab === "history" ? styles.tabActive : ""
              }`}
              onClick={() => setCurrentTab("history")}
            >
              Notifications ({notifications.length})
            </button>

            <button
              className={`${styles.tab} ${
                currentTab === "new" ? styles.tabActive : ""
              }`}
              onClick={() => setCurrentTab("new")}
            >
              New Bookings ({upcomingCount})
            </button>

            <button
              className={`${styles.tab} ${
                currentTab === "favourites" ? styles.tabActive : ""
              }`}
              onClick={() => setCurrentTab("favourites")}
            >
              My Favourites ({getFavoritesCount()})
            </button>

            <button
              className={`${styles.tab} ${
                currentTab === "reservations" ? styles.tabActive : ""
              }`}
              onClick={() => setCurrentTab("reservations")}
            >
              Reservations (
              {
                bookings.filter(
                  (b) => b.status === "upcoming" && b.payment_status !== "paid"
                ).length
              }
              )
            </button>

            <button
              className={`${styles.tab} ${
                currentTab === "settings" ? styles.tabActive : ""
              }`}
              onClick={() => setCurrentTab("settings")}
            >
              Account Settings
            </button>
          </nav>
        </div>

        <div className={styles.contentSection}>
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {currentTab === "reservations" ? (
            <div className={styles.reservationsSection}>
              <h2 className={styles.sectionTitle}>My Reservations</h2>

              {reservations.length > 0 ? (
                <div className={styles.reservationsTableWrapper}>
                  <table className={styles.reservationsTable}>
                    <thead>
                      <tr>
                        <th>Guest Name</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Countdown</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reservations.map((r) => {
                        const remainingTime = r.remainingMs
                          ? Math.floor(r.remainingMs / 1000)
                          : 0;

                        const minutes = Math.floor(remainingTime / 60);
                        const seconds = remainingTime % 60;

                        return (
                          <tr key={r.reservation_id}>
                            <td>{r.full_name}</td>
                            <td>{new Date(r.check_in).toLocaleDateString()}</td>
                            <td>
                              {new Date(r.check_out).toLocaleDateString()}
                            </td>
                            <td>{r.guests}</td>
                            <td>R {r.total_price}</td>

                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  r.isExpired ? styles.expired : styles.upcoming
                                }`}
                              >
                                {r.isExpired ? "Expired" : "Upcoming"}
                              </span>
                            </td>

                            <td>
                              {!r.isExpired ? (
                                <span className={styles.countdown}>
                                  {minutes.toString().padStart(2, "0")}:
                                  {seconds.toString().padStart(2, "0")}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>

                            <td>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(r.reservation_id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Info size={48} className={styles.emptyIcon} />
                  <h3>No reservations</h3>
                  <p>Your reservations will appear here.</p>
                </div>
              )}
            </div>
          ) : currentTab === "settings" ? (
            <div className={styles.settingsContent}>
              <div className={styles.settingsHeader}>
                <h2>Account Settings</h2>
                <p>Update your profile information</p>
              </div>

              <div className={styles.settingsCard}>
                <h3 className={styles.formTitle}>Personal Information</h3>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstname">First Name</label>
                    <input
                      id="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastname">Last Name</label>
                    <input
                      id="lastname"
                      type="text"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact">Phone / Location</label>
                    <input
                      id="contact"
                      type="text"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      placeholder="Enter phone or location"
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  {/* <button
                    className={styles.saveButton}
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader size={16} className={styles.spinIcon} />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button> */}
                </div>
              </div>
            </div>
          ) : currentTab === "history" ? (
            <div className={styles.notificationsContent}>
              <div className={styles.overviewSection}>
                <h2 className={styles.overviewTitle}>Overview</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Calendar size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>{upcomingCount}</div>
                      <div className={styles.statLabel}>Upcoming Bookings</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <CheckCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>{completedCount}</div>
                      <div className={styles.statLabel}>Completed Stays</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Bell size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>
                        {notifications.length}
                      </div>
                      <div className={styles.statLabel}>Notifications</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Clock size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>{bookings.length}</div>
                      <div className={styles.statLabel}>Total Bookings</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.notificationsHeader}>
                <h2>Notifications</h2>
                <div className={styles.notificationsActions}>
                  <button
                    className={styles.clearButton}
                    onClick={() => {
                      if (confirm("Clear all notifications?"))
                        clearNotifications();
                    }}
                    disabled={notifications.length === 0}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {notifications.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className={styles.notificationsTable}>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((n) => (
                        <tr key={n.id} className={styles.notificationRow}>
                          <td>
                            <div
                              className={`${
                                styles.typeBadge
                              } ${getTypeBadgeClass(n.type)}`}
                            >
                              {getTypeIcon(n.type)}
                              <span>{n.type}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.messageCell}>
                              <p className={styles.notifMessage}>{n.message}</p>
                              {n.booking && (
                                <div className={styles.bookingPreview}>
                                  <span className={styles.bookingInfo}>
                                    {n.booking.room_name ||
                                      `Room #${n.booking.id}`}{" "}
                                    - Check-in:{" "}
                                    {new Date(
                                      n.booking.check_in
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={styles.dateCell}>
                              {new Date(n.date).toLocaleDateString()}{" "}
                              <span className={styles.timeCell}>
                                {new Date(n.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </span>
                          </td>
                          <td>
                            <button
                              className={styles.deleteButton}
                              onClick={() => deleteNotification(n.id)}
                              title="Delete notification"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Info size={48} className={styles.emptyIcon} />
                  <h3>No notifications</h3>
                  <p>We'll show account and booking updates here.</p>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className={styles.loadingState}>
              <Loader size={40} className={styles.spinIcon} />
              <p>Loading bookings...</p>
            </div>
          ) : (
            <div className={styles.bookingsGrid}>
              {tabBookings.length > 0 ? (
                tabBookings.map((booking) => {
                  const bookingId = String(booking.id);

                  return (
                    <BookingCard
                      key={booking.id}
                      id={bookingId}
                      roomType={booking.room_name}
                      roomNumber={"101"}
                      checkIn={booking.check_in}
                      checkOut={booking.check_out}
                      guests={1}
                      status={booking.status}
                      paymentStatus={booking.payment_status}
                      imageUrl={booking.room_image || ""}
                      price={booking.total_price}
                      isFavorite={isFavorite(bookingId)}
                      onToggleFavorite={() => toggleFavorite(bookingId)}
                      onPayNow={() => handlePayNow(booking)}
                      onCancelBooking={() => handleCancelBooking(bookingId)}
                      onDeleteBooking={() => handleDeleteBooking(bookingId)}
                    />
                  );
                })
              ) : (
                <div className={styles.emptyState}>
                  <Info size={48} className={styles.emptyIcon} />
                  <h3>No bookings found</h3>
                  <p>
                    {currentTab === "favourites"
                      ? "You haven't added any favorites yet. Click the heart icon on any booking to add it here."
                      : "No bookings available in this category."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
