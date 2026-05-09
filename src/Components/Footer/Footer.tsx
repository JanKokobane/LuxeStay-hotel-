import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandColumn}>
            <p className={styles.brandTagline}>
              Experience luxury and comfort in the heart of Pretoria
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin className={styles.socialIcon} />
              </a>
            </div>
          </div>

          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              <li><a href="#home" className={styles.link}>Home</a></li>
              <li><a href="#about" className={styles.link}>About Us</a></li>
              <li><a href="#rooms" className={styles.link}>Rooms</a></li>
              <li><a href="#experience" className={styles.link}>Amenities</a></li>
              <li><a href="#gallery" className={styles.link}>Gallery</a></li>
              <li><a href="#Contact" className={styles.link}>Contact</a></li>
            </ul>
          </div>

          <div className={styles.contactColumn}>
            <h3 className={styles.columnTitle}>Contact Info</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <div>
                  <p className={styles.contactText}>Lynwood Manor</p>
                  <p className={styles.contactText}>Pretoria, Gauteng</p>
                  <p className={styles.contactText}>South Africa</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <div>
                  <p className={styles.contactText}>077 867 7675</p>
                  <p className={styles.contactTextSmall}>Available 24/7</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <div>
                  <p className={styles.contactText}>info@luxestay.com</p>
                  <p className={styles.contactTextSmall}>reservations@luxestay.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © LuxeStay. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.separator}>|</span>
            <Link to="/terms" className={styles.legalLink}>Terms of Service</Link>
            <span className={styles.separator}>|</span>
            <Link to="/cookies" className={styles.legalLink}>Cookie Policy</Link>
            <span className={styles.separator}>|</span>
            <Link to="/admin/adminreg" className={styles.legalLink}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
