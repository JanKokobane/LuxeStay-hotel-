/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import styles from "./RoomsSection.module.css";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Room {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
  price: string;
}

const rooms: Room[] = [
  {
    id: 1,
    title: "Standard Room",
    description: "Comfortable and well-appointed room with modern amenities and city views.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    badge: "POPULAR CHOICE",
    price: "R1200"
  },
  {
    id: 2,
    title: "Deluxe Room",
    description: "Spacious room with premium furnishings and enhanced amenities for extra comfort.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    badge: "BEST VALUE",
    price: "R2999"
  },
  {
    id: 3,
    title: "Executive Suite",
    description: "Luxurious suite with separate living area and premium amenities for discerning guests.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    price: "R3999"
  },
  {
    id: 4,
    title: "Presidential Suite",
    description: "The ultimate in luxury with panoramic views and exclusive amenities.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    badge: "LUXURY",
    price: "R11200"
  },
  {
    id: 5,
    title: "Family Room",
    description: "Perfect for families with connecting rooms and child-friendly amenities.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    price: "R900"
  },
  {
    id: 6,
    title: "Business Room",
    description: "Designed for business travelers with work desk and meeting facilities.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    price: "R4600"
  },
];

export const RoomsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  // Divide rooms into slices of 3 for desktop, 1 for mobile
  // But let's actually just use the currentIndex to show a sliding window
  const visibleRoomsCount = 3;

  return (
    <section className={styles.section} id="rooms">
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.heading}>Our Suites</h2>
          <p className={styles.description}>
            Choose from our selection of beautifully designed rooms, each offering comfort and
            luxury for the perfect stay at Luxetay.
          </p>
        </div>
        <div className={styles.headerActions}>
           <Link to="/rooms" className={styles.findMoreBtn}>
            FIND MORE ROOMS
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className={styles.carouselWrapper}>
        <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrev}>
          <ChevronLeft />
        </button>

        <div className={styles.carousel}>
          <motion.div
            className={styles.carouselTrack}
            animate={{ x: `-${currentIndex * (100 / 3.1)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {rooms.map((room) => (
              <div key={room.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={room.image} alt={room.title} className={styles.image} />
                  {room.badge && <div className={styles.badge}>{room.badge}</div>}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.roomTitle}>{room.title}</h3>
                  <p className={styles.roomDescription}>{room.description}</p>
                  <p className={styles.roomPrice}>{room.price} <span className={styles.perNight}>/ night</span></p>

                  <Link to="/rooms">
                    <button className={styles.button}>View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext}>
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};
