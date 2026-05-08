import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>LuxeStay</Link>
      
      <div className={styles.navLinks}>
        <Link to="/search" className={styles.navLink}>
          Rooms
        </Link>
        <Link to="/popular" className={styles.navLink}>
          Our popular rooms
        </Link>
      </div>

      <div className={styles.authButtons}>
        {user ? (
          <div className={styles.userSection}>
            <Link to="/profile" className={styles.profileLink}>
              <div className={styles.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              Hi, {user.name?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn} title="Log out">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className={styles.userSection}>
            <Link
              to="/auth"
              state={{ mode: 'signup' }}
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              Sign up
            </Link>
            <Link
              to="/auth"
              state={{ mode: 'login' }}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
