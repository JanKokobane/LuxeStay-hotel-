import { useEffect, useState } from 'react';
import {Star,Users,Bed,Wifi,Coffee,Tv,Wind,Droplet,Search,SlidersHorizontal,X,} from 'lucide-react';
import styles from './RoomsPage.module.css';
import RoomDetailModal from './RoomDetailModal/RoomDetailModal';
import React from 'react';
import BookingForm from './BookingForm/BookingForm';
import { useNavigate } from "react-router-dom";

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string;
  image: string;
  status: string;
  rating?: number;
  reviews?: number;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'book' | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');

  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://tango-hotel-backend.onrender.com';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/rooms`);
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json();

        const roomsWithRatings = data.map((room: Room) => ({
          ...room,
          rating: room.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
          reviews: room.reviews || Math.floor(Math.random() * 200 + 50),
        }));

        setRooms(roomsWithRatings);
        setFilteredRooms(roomsWithRatings);
      } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError('Could not load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (room) => room.price >= priceRange.min && room.price <= priceRange.max
    );

    if (selectedType !== 'all') {
      filtered = filtered.filter(
        (room) => room.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedCapacity !== 'all') {
      filtered = filtered.filter(
        (room) => room.capacity >= parseInt(selectedCapacity)
      );
    }

    setFilteredRooms(filtered);
  }, [searchTerm, priceRange, selectedType, selectedCapacity, rooms]);

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi size={16} />;
    if (lower.includes('tv')) return <Tv size={16} />;
    if (lower.includes('coffee') || lower.includes('breakfast')) return <Coffee size={16} />;
    if (lower.includes('ac') || lower.includes('air')) return <Wind size={16} />;
    if (lower.includes('shower') || lower.includes('bath')) return <Droplet size={16} />;
    return <Bed size={16} />;
  };

  const renderStars = (rating: number) => (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= Math.floor(rating) ? 'goldenrod' : 'none'}
          stroke={star <= Math.floor(rating) ? 'goldenrod' : '#ddd'}
        />
      ))}
    </div>
  );

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: 0, max: 10000 });
    setSelectedType('all');
    setSelectedCapacity('all');
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setModalMode('view');
  };

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    setModalMode('book');
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setModalMode(null);
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.heading}>Discover Your Perfect Stay</h1>
            <p className={styles.description}>
              Experience luxury and comfort in our carefully curated selection of rooms.
              Each space is designed to provide you with an unforgettable experience.
            </p>
          </div>
        </div>

        <div className={styles.backButtonContainer}>
          <button
            onClick={() => navigate("/")}
            className={styles.backButton}
          >
            ← Back to Home
          </button>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search by room name, type, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range (R)</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })
                  }
                  className={styles.priceInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })
                  }
                  className={styles.priceInput}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Room Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Any</option>
                <option value="1">1+ Guests</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <button onClick={resetFilters} className={styles.resetBtn}>
              Reset Filters
            </button>
          </div>
        )}

        <div className={styles.resultsBar}>
          <p className={styles.resultsCount}>
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} available
          </p>
        </div>

        {loading && <p className={styles.status}>Loading rooms...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {filteredRooms.map((room) => (
              <div key={room.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={
                      room.image ||
                      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'
                    }
                    alt={room.name}
                    className={styles.image}
                  />

                  {/* ✅ Room Status Badges */}
                  {room.status?.toLowerCase() === 'available' && (
                    <span className={styles.badge}>Available</span>
                  )}
                  {room.status?.toLowerCase() === 'booked' && (
                    <span className={`${styles.badge} ${styles.bookedBadge}`}>Booked</span>
                  )}
                  {room.status?.toLowerCase() === 'featured' && (
                    <span className={`${styles.badge} ${styles.featuredBadge}`}>Featured</span>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.roomTitle}>{room.name}</h3>
                    <div className={styles.ratingWrapper}>
                      {renderStars(Number(room.rating))}
                      <span className={styles.ratingText}>
                        {room.rating} ({room.reviews})
                      </span>
                    </div>
                  </div>

                  <div className={styles.roomMeta}>
                    <span className={styles.roomType}>{room.type}</span>
                    <span className={styles.capacity}>
                      <Users size={14} />
                      {room.capacity} Guests
                    </span>
                  </div>

                  <p className={styles.roomDescription}>
                    {room.description.length > 100
                      ? `${room.description.substring(0, 100)}...`
                      : room.description}
                  </p>

                  <div className={styles.amenities}>
                    {room.amenities
                      ?.split(',')
                      .slice(0, 4)
                      .map((amenity, i) => (
                        <span key={i} className={styles.amenityTag}>
                          {getAmenityIcon(amenity)}
                          {amenity.trim()}
                        </span>
                      ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.price}>R{room.price}</span>
                      <span className={styles.priceLabel}>/ night</span>
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => handleViewDetails(room)}
                      >
                        View Details
                      </button>

                      {/* ✅ Book Now Button Logic */}
                      <button
                        className={styles.bookButton}
                        onClick={() => handleBookNow(room)}
                        disabled={room.status?.toLowerCase() === 'booked'}
                      >
                        {room.status?.toLowerCase() === 'booked'
                          ? 'Unavailable'
                          : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredRooms.length === 0 && (
          <div className={styles.noResults}>
            <p>No rooms found matching your criteria.</p>
            <button onClick={resetFilters} className={styles.resetBtn}>
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {selectedRoom && modalMode === 'view' && (
        <RoomDetailModal room={selectedRoom} onClose={handleCloseModal} mode="view" />
      )}

      {selectedRoom && modalMode === 'book' && (
        <BookingForm room={selectedRoom} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default RoomsPage;
