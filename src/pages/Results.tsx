import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../api';
import styles from './Results.module.css';

export default function Results() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    breakfast: false,
    freeWifi: false,
    priceRange: [0, 1000]
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHotels() {
      try {
        const data = await hotelApi.getHotels();
        setHotels(data);
        setFilteredHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHotels();
  }, []);

  useEffect(() => {
    let result = [...hotels];
    if (filters.breakfast) {
      // Simulation: filter out every second hotel
      result = result.filter((_, i) => i % 2 === 0);
    }
    if (filters.freeWifi) {
      // Simulation: filter out every third hotel
      result = result.filter((_, i) => i % 3 !== 1);
    }
    result = result.filter(h => h.price >= filters.priceRange[0] && h.price <= filters.priceRange[1]);
    setFilteredHotels(result);
  }, [filters, hotels]);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.searchCard}>
          <h3>Your search</h3>
          <div className={styles.searchField}>
            <label>Check-in</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} />
              <input type="date" defaultValue="2022-12-09" />
            </div>
          </div>
          <div className={styles.searchField}>
            <label>Check-out date</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} />
              <input type="date" defaultValue="2022-12-12" />
            </div>
          </div>
          <div className={styles.searchField}>
            <label>Guests</label>
            <div className={styles.inputWrapper}>
              <Users size={16} />
              <input type="text" defaultValue="2 adults, 1 room" />
            </div>
          </div>
          <button className={styles.searchBtn}>Search</button>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterHeader}>
            <h3>Budget (per night)</h3>
            <button className={styles.resetBtn} onClick={() => setFilters({ breakfast: false, freeWifi: false, priceRange: [0, 1000] })}>Reset</button>
          </div>
          
          <div className={styles.rangeSection}>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}>
              <span>R 0</span>
              <span>R {filters.priceRange[1]}</span>
            </div>
          </div>

          <h3>Popular filters</h3>
          <div className={styles.filterGroup}>
            <div className={styles.filterItem} onClick={() => setFilters({...filters, breakfast: !filters.breakfast})}>
              <div className={`${styles.checkbox} ${filters.breakfast ? styles.checkboxActive : ''}`}>
                {filters.breakfast && <Check size={14} color="white" />}
              </div>
              <span className={filters.breakfast ? styles.filterItemActive : styles.filterItemInactive}>Breakfast included</span>
            </div>
            <div className={styles.filterItem} onClick={() => setFilters({...filters, freeWifi: !filters.freeWifi})}>
              <div className={`${styles.checkbox} ${filters.freeWifi ? styles.checkboxActive : ''}`}>
                {filters.freeWifi && <Check size={14} color="white" />}
              </div>
              <span className={filters.freeWifi ? styles.filterItemActive : styles.filterItemInactive}>Free WiFi</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.resultsHeader}>
          <div className={styles.summary}>
            <p>{filteredHotels.length} luxury rooms found</p>
            <h2>Available options</h2>
          </div>
          <div className={styles.sort}>
            <span>Sort by</span>
            <ChevronDown size={16} />
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading luxury stays...</div>
        ) : (
          <div className={styles.hotelList}>
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className={styles.hotelCard}>
                <div className={styles.hotelImage}>
                  <img src={hotel.image} alt={hotel.name} />
                </div>
                <div className={styles.hotelInfo}>
                  <div className={styles.hotelHeader}>
                    <h3>{hotel.name}</h3>
                    <div className={styles.rating}>
                      <div className={styles.ratingText}>
                        <div className={styles.ratingLabel}>{hotel.ratingText}</div>
                        <div className={styles.reviews}>{hotel.reviews.toLocaleString()} reviews</div>
                      </div>
                      <div className={styles.ratingScore}>{hotel.rating}</div>
                    </div>
                  </div>
                  <div className={styles.subInfo}>
                    <div>{hotel.distance}</div>
                    <div className={styles.amenityTags}>
                      <span>Breakfast included • </span>
                      <span>Free WiFi</span>
                    </div>
                  </div>
                  <div className={styles.roomDetails}>
                    <span className={styles.premiumBadge}>Premium Selection</span>
                    <span className={styles.roomDesc}>1x king size bed • Private balcony</span>
                  </div>
                  <div className={styles.badgeGroup}>
                    <span className={styles.badge}>#Popular</span>
                    <span className={styles.badge}>#BestValue</span>
                  </div>
                </div>
                <div className={styles.priceSection}>
                  <div className={styles.price}>R {hotel.price}</div>
                  <div className={styles.priceNote}>Per night • 2 guests</div>
                  <button className={styles.bookingBtn} onClick={() => navigate(`/hotel/${hotel.id}`)}>View Room</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
