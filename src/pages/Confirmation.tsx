import { Check, Calendar, HardDrive } from 'lucide-react';
import styles from './Confirmation.module.css';

export default function Confirmation() {
  return (
    <div className={styles.container}>
      <div className={styles.successSection}>
        <div className={styles.leftCard}>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
            alt="Room" 
            className={styles.hotelImg}
          />
          <h2 className={styles.hotelName}>LuxeStay Suite</h2>
          <p className={styles.hotelSub}>Premium luxury stay in the heart of the city</p>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Check-in</span>
              <span className={styles.value}>Friday, 09 December 2022</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Check-out</span>
              <span className={styles.value}>Monday, 12 December 2022</span>
            </div>
          </div>

          <div className={styles.roomType}>Standard Deluxe Room</div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.checkCircle}>
            <Check size={40} strokeWidth={3} />
          </div>
          <h2>Your booking is now confirmed!</h2>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h3>Your trip starts Friday, 09 December 2022</h3>
        
        <div className={styles.detailRow}>
          <div className={styles.detailLabel}>
            <Calendar size={18} />
            Check-in
          </div>
          <div className={styles.detailValue}>Friday, 09 December 2022, from 3 PM</div>
        </div>

        <div className={styles.detailRow}>
          <div className={styles.detailLabel}>
            <HardDrive size={18} className={styles.rotate90} />
            Check-out
          </div>
          <div className={styles.detailValue}>Monday, 12 December 2022, until 11 AM</div>
        </div>

        <div className={styles.footerInfo}>
          <div className={styles.footerRow}>
            <div className={styles.footerLabel}>Room</div>
            <div className={styles.footerValue}>LuxeStay Residences, 10178 Cape Town, South Africa</div>
          </div>
          <div className={styles.footerRow}>
            <div className={styles.footerLabel}>Email</div>
            <div className={styles.footerValue}>concierge@luxestay.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
