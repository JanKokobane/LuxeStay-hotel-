import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import styles from "./Styles/AdminDashboard.module.css";
import type { Room } from "../../AdminDashboard";
import React from "react";

interface RoomsSectionProps {
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  compact?: boolean;
}

interface RoomsSectionProps {
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void; 
}

const API_BASE_URL = "https://tango-hotel-backend.onrender.com";

function RoomsSection({
  onAddRoom,
  onEditRoom,
  compact = false,
}: RoomsSectionProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRooms(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDeleteRoom = async (roomId: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Admin token missing. Please log in.");
      return;
    }

    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete room: ${errorText}`);
      }

      setRooms((prev) => prev.filter((room) => room.id.toString() !== roomId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete room. Check your token or permissions.");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const displayedRooms = compact ? filteredRooms.slice(0, 5) : filteredRooms;

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {compact ? "Recent Rooms" : "Room Management"}
        </h2>
        <button className={styles.primaryButton} onClick={onAddRoom}>
          <Plus size={18} />
          <span>Add Room</span>
        </button>
      </div>

      {!compact && (
        <div className={styles.searchBar}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search rooms by name or type..."
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
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      )}

      {displayedRooms.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRooms.map((room) => (
                <tr key={room.id}>
                  <td>
                    <div className={styles.roomInfo}>
                      <img
                        src={room.image || "https://via.placeholder.com/80"}
                        alt={room.name}
                        className={styles.roomImage}
                      />
                      <div className={styles.roomDetails}>
                        <h4>{room.name}</h4>
                        <p>Room ID: {room.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{room.type}</td>
                  <td>{room.capacity} guests</td>
                  <td>
                    <strong>R {room.price.toLocaleString()}</strong>/night
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[room.status]}`}>
                      {room.status.charAt(0).toUpperCase() +
                        room.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.view}`}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.edit}`}
                        onClick={() => onEditRoom(room)}
                        title="Edit Room"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteRoom(room.id.toString())}
                        title="Delete Room"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Search size={64} />
          <h3>No rooms found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default RoomsSection;
