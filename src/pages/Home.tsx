import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../api';
import styles from './Home.module.css';

export default function Home() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await hotelApi.getHotels();
        setRooms(data);
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

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Exquisite rooms for the discerning traveler</h1>
          <p>Discover handpicked suites in the world's most desirable locations.</p>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchItem}>
            <label>Check-in</label>
            <input type="date" />
          </div>
          <div className={styles.searchItem}>
            <label>Check-out</label>
            <input type="date" />
          </div>
          <div className={styles.searchItem}>
            <label>Guests</label>
            <input type="text" placeholder="Number of guests" />
          </div>
          <button className={styles.searchButton} onClick={() => navigate('/search')}>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Our popular rooms</h2>
            <p>The most sought-after experiences in our collection.</p>
          </div>
          <button onClick={() => navigate('/search')} className={styles.btnSecondary}>
            View full list <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading luxury stays...</div>
        ) : (
          <div className={styles.featuredGrid}>
            {rooms.slice(0, 2).map((room) => (
              <div 
                key={room.id}
                onClick={() => navigate(`/hotel/${room.id}`)}
                className={styles.featuredCard}
              >
                <div className={styles.imageWrapper}>
                  <img src={room.image} alt={room.name} />
                </div>
                <div className={styles.cardContent}>
                  <div>
                    <div className={styles.ratingTag}>
                      <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                      <span className={styles.ratingLabel}>{room.ratingText} Selection</span>
                    </div>
                    <h3 className={styles.cardTitle}>{room.name}</h3>
                    <p className={styles.cardDesc}>{room.description}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <div>
                      <span className={styles.price}>R {room.price}</span>
                      <span className={styles.nightly}>Per night</span>
                    </div>
                    <div className={styles.actionIcon}>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Featured collection</h2>
            <p>Handpicked suites and residential rooms.</p>
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loadingState}>Loading luxury stays...</div>
        ) : (
          <div className={`${styles.grid} ${styles.cols3}`}>
            {rooms.map((room) => (
              <div 
                key={room.id} 
                className={styles.roomCard}
                onClick={() => navigate(`/hotel/${room.id}`)}
              >
                <div className={styles.roomImage}>
                  <img src={room.image} alt={room.name} />
                  <div className={styles.badge}>
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{room.rating}</span>
                  </div>
                </div>
                <div className={styles.roomInfo}>
                  <h3 className={styles.roomTitle}>{room.name}</h3>
                  <p className={styles.roomDesc}>{room.description}</p>
                  <div className={styles.roomFooter}>
                    <div>
                      <span className={styles.priceSmall}>R {room.price}</span>
                      <span className={styles.perNight}>/ night</span>
                    </div>
                    <button className={styles.detailsLink}>View details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.seasonal}>
          <div className={styles.seasonalContent}>
            <div>
              <span className={styles.seasonalTag}>Seasonal Edit</span>
              <h2 className={styles.seasonalTitle}>Our popular rooms this winter</h2>
              <p className={styles.seasonalDesc}>Experience the perfect blend of warmth and elegance in our curated winter selection.</p>
              <button 
                onClick={() => navigate('/search')}
                className={styles.seasonalBtn}
              >
                View collection
              </button>
            </div>
            <div className={styles.seasonalGallery}>
              <div className={styles.galleryColumn}>
                <div className={`${styles.galleryItem} ${styles.h64}`}>
                  <img src="https://m.media-amazon.com/images/I/413sS3VIItL._AC_SY300_SX300_QL70_ML2_.jpg" alt="Suites" />
                </div>
                <div className={`${styles.galleryItem} ${styles.h44}`}>
                  <img src="https://m.media-amazon.com/images/I/71s+yAj4zfL._AC_SY300_SX300_QL70_ML2_.jpg" alt="Interior" />
                </div>
              </div>
              <div className={styles.galleryColumn}>
                <div className={`${styles.galleryItem} ${styles.h44}`}>
                  <img src="https://m.media-amazon.com/images/I/714PcNNu64L._AC_SX300_SY300_QL70_ML2_.jpg" alt="Bathroom" />
                </div>
                <div className={`${styles.galleryItem} ${styles.h64}`}>
                  <img src="https://m.media-amazon.com/images/I/41P2ETON8-L._AC_SX569_.jpg" alt="Lounge" />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.decoration1}></div>
          <div className={styles.decoration2}></div>
        </div>
      </div>
    </div>
  );
}
