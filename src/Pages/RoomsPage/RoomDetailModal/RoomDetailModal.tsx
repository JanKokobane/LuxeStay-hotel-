import React, { useState } from 'react'; 
import {X,Star,Users,Bed,Wifi,Coffee,Tv,Wind,Droplet,Calendar,CreditCard,Car,Briefcase,Utensils,Dumbbell,Flame,ShowerHead,PawPrint,CigaretteOff,Luggage,Sparkles} from 'lucide-react';
import styles from './RoomDetailModal.module.css';

interface Room {
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

interface RoomDetailModalProps {
  room: Room;
  onClose: () => void;
  mode?: 'view' | 'book'; 
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);


  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();

    if (lower.includes('wifi')) return <Wifi size={18} color="#3b82f6" />;
    if (lower.includes('air')) return <Wind size={18} color="#06b6d4" />;
    if (lower.includes('mini bar') || lower.includes('bar')) return <Coffee size={18} color="#b45309" />;
    if (lower.includes('ocean')) return <Droplet size={18} color="#0ea5e9" />;
    if (lower.includes('room service')) return <Bed size={18} color="#22c55e" />;
    if (lower.includes('spa')) return <Wind size={18} color="#e879f9" />;
    if (lower.includes('balcony')) return <Tv size={18} color="#facc15" />;
    if (lower.includes('parking')) return <Car size={18} color="#6b7280" />;
    if (lower.includes('workspace') || lower.includes('desk')) return <Briefcase size={18} color="#475569" />;
    if (lower.includes('restaurant') || lower.includes('dining')) return <Utensils size={18} color="#f97316" />;
    if (lower.includes('pool') || lower.includes('swim')) return <Droplet size={18} color="#38bdf8" />;
    if (lower.includes('gym') || lower.includes('fitness')) return <Dumbbell size={18} color="#22c55e" />;
    if (lower.includes('heater') || lower.includes('fire')) return <Flame size={18} color="#f87171" />;
    if (lower.includes('laundry')) return <ShowerHead size={18} color="#a78bfa" />;
    if (lower.includes('pet')) return <PawPrint size={18} color="#f59e0b" />;
    if (lower.includes('non-smoking') || lower.includes('smoke free')) return <CigaretteOff size={18} color="#9ca3af" />;
    if (lower.includes('luggage') || lower.includes('storage')) return <Luggage size={18} color="#475569" />;
    if (lower.includes('toiletries') || lower.includes('amenities')) return <Sparkles size={18} color="#a855f7" />;
    if (lower.includes('extra bed')) return <Bed size={18} color="#22d3ee" />;
    if (lower.includes('tv')) return <Tv size={18} />;
    if (lower.includes('coffee') || lower.includes('breakfast')) return <Coffee size={18} />;
    if (lower.includes('ac') || lower.includes('cool')) return <Wind size={18} />;
    if (lower.includes('shower') || lower.includes('bath')) return <Droplet size={18} />;
    return <Bed size={18} />;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalPrice = calculateNights() * room.price;

  const [showReservationPopup, setShowReservationPopup] = useState(false);


 const handleSubmitReview = async (e: { preventDefault: () => void }) => {
  e.preventDefault();

  if (!userName || !userRating || !reviewText) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch("https://tango-hotel-backend.onrender.com/api/reviews/submit-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        rating: userRating,
        experience: reviewText,
        room_id: Number(room.id),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit review");
    }

    alert("Review submitted!");
    setUserName("");
    setUserRating(0);
    setReviewText("");

  } catch (err) {
    console.error("Review submit error:", err);
    alert("Failed to submit review");
  }
};

const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!fullName || !email || !checkIn || !checkOut) {
    alert("Please fill all fields");
    return;
  }

  const nights = calculateNights();
  const totalPrice = nights * room.price;

  try {
    const res = await fetch("https://tango-hotel-backend.onrender.com/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        email,
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to create reservation");
    }

    setShowReservationPopup(true);

    setFullName("");
    setEmail("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);

  } catch (err) {
    console.error("Reservation error:", err);
    alert("Failed to create reservation. Try again.");
  }
};


  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalGrid}>
        
          <div className={styles.leftColumn}>
            <div className={styles.imageContainer}>
              <img 
                src={room.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'} 
                alt={room.name}
                className={styles.mainImage}
              />
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.headerSection}>
                <h2 className={styles.modalTitle}>{room.name}</h2>
                <div className={styles.ratingWrapper}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= Math.floor(Number(room.rating)) ? 'goldenrod' : 'none'}
                        stroke={star <= Math.floor(Number(room.rating)) ? 'goldenrod' : '#ddd'}
                      />
                    ))}
                  </div>
                  <span className={styles.ratingText}>
                    {room.rating} ({room.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Type:</span>
                  <span className={styles.metaValue}>{room.type}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Capacity:</span>
                  <span className={styles.metaValue}>
                    <Users size={16} />
                    Up to {room.capacity} guests
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status:</span>
                  <span className={`${styles.status} ${room.status.toLowerCase() === 'available' ? styles.statusAvailable : ''}`}>
                    {room.status}
                  </span>
                </div>
              </div>

              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>About This Room</h3>
                <p className={styles.description}>{room.description}</p>
              </div>

              <div className={styles.amenitiesSection}>
                <h3 className={styles.sectionTitle}>Amenities</h3>
                <div className={styles.amenitiesList}>
                  {room.amenities?.split(',').map((amenity, i) => (
                    <div key={i} className={styles.amenityItem}>
                      {getAmenityIcon(amenity)}
                      <span>{amenity.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>


              <div className={styles.reviewSection}>
                <h3 className={styles.sectionTitle}>Leave a Review</h3>
                <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={styles.reviewInput}
                    required
                  />
                  
                  <div className={styles.ratingInput}>
                    <label>Your Rating:</label>
                    <div className={styles.interactiveStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={24}
                          fill={star <= (hoverRating || userRating) ? 'goldenrod' : 'none'}
                          stroke={star <= (hoverRating || userRating) ? 'goldenrod' : '#ddd'}
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  </div>

                  <textarea
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className={styles.reviewTextarea}
                    rows={4}
                    required
                  />

                  <button type="submit" className={styles.submitReviewBtn}>
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {showReservationPopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupContent}>
                <h2>Reservation Created!</h2>
                <p>Please complete payment within 30 minutes to secure your room.</p>
                <button
                  className={styles.popupCloseBtn}
                  onClick={() => setShowReservationPopup(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          <div className={styles.rightColumn}>
            <div className={styles.bookingCard}>
              <div className={styles.priceHeader}>
                <span className={styles.price}>R{room.price}</span>
                <span className={styles.priceLabel}>per night</span>
              </div>

              <form onSubmit={handleBooking} className={styles.bookingForm}>
          
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.formInput}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

          
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.formInput}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Calendar size={16} />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={styles.formInput}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Calendar size={16} />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={styles.formInput}
                    required
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Users size={16} />
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className={styles.formSelect}
                    required
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {checkIn && checkOut && (
                  <div className={styles.priceBreakdown}>
                    <div className={styles.breakdownRow}>
                      <span>R{room.price} × {calculateNights()} nights</span>
                      <span>R{totalPrice}</span>
                    </div>
                    <div className={styles.breakdownRow}>
                      <span>Service fee</span>
                      <span>R{Math.round(totalPrice * 0.1)}</span>
                    </div>
                    <div className={`${styles.breakdownRow} ${styles.total}`}>
                      <span>Total</span>
                      <span>R{totalPrice + Math.round(totalPrice * 0.1)}</span>
                    </div>
                  </div>
                )}

                <button type="submit" className={styles.bookNowBtn}>
                  <CreditCard size={18} />
                  Reserve Now
                </button>

                <p className={styles.bookingNote}>
                  You won't be charged yet
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
function fetchRoomReviews(selectedRoomId: any) {
  throw new Error('Function not implemented.');
}

