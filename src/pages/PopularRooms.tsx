import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../api';
import styles from './PopularRooms.module.css';

export default function PopularRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await hotelApi.getHotels();
        // Sort by rating to show "popular" ones
        const sorted = [...data].sort((a, b) => b.rating - a.rating);
        setRooms(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Our popular rooms</h1>
        <p>
          The most frequently reserved accommodations in our portfolio, chosen by guests for their 
          exceptional design, prime location, and unparalleled comfort.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Curating our best rooms...</div>
      ) : (
        <div className={styles.grid}>
          {rooms.map((room) => (
            <div 
              key={room.id}
              onClick={() => navigate(`/hotel/${room.id}`)}
              className={styles.card}
            >
              <div className={styles.imageSection}>
                <img 
                  src={room.image} 
                  alt={room.name} 
                />
                <button className={styles.heartBtn}>
                  <Heart size={20} />
                </button>
                <div className={styles.ratingBadge}>
                  <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                  <span>{room.rating}</span>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <div>
                  <div className={styles.tagSection}>
                    <span className={styles.tag}>Guest Favorite</span>
                    <div className={styles.divider}></div>
                  </div>
                  <h3 className={styles.cardTitle}>{room.name}</h3>
                  <p className={styles.cardDesc}>{room.description}</p>
                </div>
                <div className={styles.footer}>
                  <div>
                    <span className={styles.priceLabel}>R {room.price}</span>
                    <span className={styles.perNight}>Per night</span>
                  </div>
                  <button className={styles.bookBtn}>
                    Book Now <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
