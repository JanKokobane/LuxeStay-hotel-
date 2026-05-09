import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Menu, X, User } from "lucide-react";
import styles from "./Header.module.css";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
 

  return (
    <nav className={`${styles.navbar}`}>
      <div className={styles.logo}>
        LuxeStay
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
        <div className={styles.centerLinks}>
          <Link to="/#home">Home</Link>
          <Link to="/#about">About</Link>
          <Link to="/#rooms">Rooms</Link>
          <Link to="/#experience">Experience</Link>
          <Link to="/#gallery">Gallery</Link>
          <Link to="/#contact">Contact Us</Link>
        </div>
      </div>


    </nav>
  );
};

export default Navbar;
