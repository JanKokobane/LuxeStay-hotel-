import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="app-footer">
      <div className={styles.content}>
        <div className={styles.brand}>
          
          <p className={styles.tagline}>
            Exceptional stays, tailored for the modern traveler. Experience the height of hospitality in South Africa's most stunning locations.
          </p>
          <div className={{ display: 'flex', gap: '1rem', marginTop: '1rem' } as any}>
            <Facebook size={18} className={styles.linkItem} />
            <Twitter size={18} className={styles.linkItem} />
            <Instagram size={18} className={styles.linkItem} />
          </div>
        </div>

        <div>
          <h4 className={styles.linksTitle}>Quick Links</h4>
          <ul className={styles.linkList}>
            <li><Link to="/" className={styles.linkItem}>Home</Link></li>
            <li><Link to="/search" className={styles.linkItem}>Browse Hotels</Link></li>
            <li><Link to="/popular" className={styles.linkItem}>Popular Rooms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.linksTitle}>Support & Contact</h4>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}><MapPin size={14} /> Pretoria, ZA</li>
            <li className={styles.linkItem}><Mail size={14} /> support@luxestay.co.za</li>
            <li><Link to="#" className={styles.linkItem}>Privacy Policy</Link></li>
            <li><Link to="#" className={styles.linkItem}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} LuxeStay South Africa. 
        </p>
        
        <Link to="/admin" className={styles.adminLink}>
          <ShieldCheck size={14} />
          Admin Staff Portal
        </Link>
      </div>
    </footer>
  );
}
