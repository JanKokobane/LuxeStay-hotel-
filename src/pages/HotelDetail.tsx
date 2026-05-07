import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wifi, Car, Wind, Bath, Key, Clock, Star, Coffee, Monitor, ShieldCheck } from 'lucide-react';
import { hotelApi, bookingApi } from '../api';
import styles from './HotelDetail.module.css';

const amenityIcons: Record<string, React.ReactElement> = {
  'Free Wifi': <Wifi size={18} />,
  'Free parking': <Car size={18} />,
  'Air conditioning': <Wind size={18} />,
  '24-hour front desk': <Clock size={18} />,
  'Private bathroom': <Bath size={18} />,
  'Key card access': <Key size={18} />,
};

export default function HotelDetail() {
  const [hotel, setHotel] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHotel() {
      try {
        const data = await hotelApi.getHotel(id!);
        setHotel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      await bookingApi.createBooking({
        hotelId: hotel.id,
        ...bookingData
      });
      navigate('/confirmation');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loadingContainer}>Loading room details...</div>;
  if (!hotel) return <div className={styles.errorContainer}>Stay not found.</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={24} />
      </button>

      <div className={styles.gallery}>
        <div className={styles.largeImage}>
          <img src={hotel.image} alt={hotel.name} />
        </div>
        <div className={styles.smallImage}>
           <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80" alt="Interior" />
        </div>
        <div className={styles.smallImage}>
           <img src="https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=600&q=80" alt="Bath" />
        </div>
        <div className={styles.smallImage}>
           <img src="https://images.unsplash.com/photo-1560185007-cde431d16790?auto=format&fit=crop&w=600&q=80" alt="Lounge" />
        </div>
        <div className={styles.smallImage}>
           <img src="https://images.unsplash.com/photo-1560185893-a55caf0a52f9?auto=format&fit=crop&w=600&q=80" alt="View" />
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{hotel.name}</h1>
          <p>{hotel.stars}-star luxury stay</p>
        </div>
        <div className={styles.rating}>
          <div className={styles.ratingText}>
            <div className={styles.ratingLabel}>{hotel.ratingText}</div>
            <div className={styles.reviews}>{hotel.reviews.toLocaleString()} reviews</div>
          </div>
          <div className={styles.ratingScore}>{hotel.rating}</div>
        </div>
      </div>

      <div className={styles.tabs}>
        {['Overview', 'Amenities', 'Policies', 'Reviews'].map((tab) => (
          <div
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.overview}>
          {activeTab === 'Overview' && (
            <div className={styles.overviewContainer}>
              <div className={styles.mainOverview}>
                <h2>Experience refinement</h2>
                <div className={styles.amenities}>
                  {Object.entries(amenityIcons).map(([label, icon], i) => (
                    <div key={i} className={styles.amenity}>
                      {icon}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.fullDescription}>
                  {hotel.description}
                </div>
              </div>

              <div className={styles.bookingSidebar}>
                <div className={styles.sidebarPrice}>
                  <span className={styles.sidebarPriceValue}>R {hotel.price}</span>
                  <span className={styles.sidebarPriceLabel}>/ night</span>
                  <div className={styles.sidebarDivider}></div>
                </div>

                <div className={styles.sidebarItems}>
                  <div className={styles.sidebarItem}>
                    <div className={styles.sidebarIcon}>
                      <Clock size={20} />
                    </div>
                    <div className={styles.sidebarItemText}>
                      <p>Check-in</p>
                      <p>From 14:00 PM</p>
                    </div>
                  </div>
                  
                  <div className={styles.sidebarItem}>
                    <div className={styles.sidebarIcon}>
                      <ShieldCheck size={20} />
                    </div>
                    <div className={styles.sidebarItemText}>
                      <p>Policy</p>
                      <p>Free Cancellation</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/book/${hotel.id}`)}
                    className={styles.reserveBtn}
                  >
                    Reserve Your Stay
                  </button>
                  
                  <p className={styles.instantNote}>
                    Instant Confirmation
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Amenities' && (
            <div className={styles.amenitiesGrid}>
              <div className={styles.amenityCategory}>
                <div>
                  <h3 className={styles.categoryTitle}>
                    <Coffee size={18} /> Food & Drink
                  </h3>
                  <ul className={styles.amenityList}>
                    <li>• Gourmet mini-bar with curated selections</li>
                    <li>• 24-hour private dining service</li>
                    <li>• Premium Nespresso coffee system</li>
                    <li>• Daily artisanal breakfast delivery</li>
                  </ul>
                </div>
                <div>
                  <h3 className={styles.categoryTitle}>
                    <ShieldCheck size={18} /> Wellness & Safety
                  </h3>
                  <ul className={styles.amenityList}>
                    <li>• In-room safe for valuables</li>
                    <li>• Dedicated concierge support</li>
                    <li>• Premium organic toiletries</li>
                  </ul>
                </div>
              </div>
              <div className={styles.amenityCategory}>
                <div>
                  <h3 className={styles.categoryTitle}>
                    <Monitor size={18} /> Technology
                  </h3>
                  <ul className={styles.amenityList}>
                    <li>• Smart 4K TV with international channels</li>
                    <li>• High-fidelity surround sound</li>
                    <li>• Hyper-speed fiber optic WiFi</li>
                    <li>• Intelligent climate control system</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Policies' && (
            <div className={styles.policySection}>
              <div className={styles.arrivalCard}>
                <h3 className={styles.arrivalTitle}>
                  <Clock size={20} /> Arrival & Departure
                </h3>
                <div className={styles.arrivalGrid}>
                  <div className={styles.arrivalBox}>
                    <div className={styles.arrivalLabel}>Check-in</div>
                    <div className={styles.arrivalTime}>3:00 <span>PM</span></div>
                  </div>
                  <div className={styles.arrivalBox}>
                    <div className={styles.arrivalLabel}>Check-out</div>
                    <div className={styles.arrivalTime}>12:00 <span>PM</span></div>
                  </div>
                </div>
              </div>
              <div className={styles.simplePolicy}>
                <h3>Cancellation Policy</h3>
                <p>
                  Enjoy the flexibility of free cancellation up to 48 hours before your scheduled arrival. 
                  Cancellations made within 48 hours will be subject to a one-night stay charge.
                </p>
              </div>
              <div className={styles.simplePolicy}>
                <h3>General Terms</h3>
                <p>
                  LuxeStay is a smoke-free environment. To maintain our serene atmosphere, quiet hours are observed 
                  between 11 PM and 7 AM. Pets are welcomed in specific designated suites.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className={styles.map}>
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" 
            alt="Map Location" 
            className={styles.mapImage}
          />
        </div>
      </div>
    </div>
  );
}
