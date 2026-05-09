import React from "react";
import { Waves, Dumbbell, UtensilsCrossed, Sparkles } from "lucide-react";
import styles from "./HotelAmenities.module.css";

interface Amenity {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const amenities: Amenity[] = [
  {
    icon: <Waves />,
    title: "Swimming Pool",
    description: "Outdoor pool with city views and poolside service",
  },
  {
    icon: <Dumbbell />,
    title: "Fitness Center",
    description: "24/7 access to modern equipment and personal trainers",
  },
  {
    icon: <UtensilsCrossed />,
    title: "Fine Dining",
    description: "Multiple restaurants serving international cuisine",
  },
  {
    icon: <Sparkles />,
    title: "Spa & Wellness",
    description: "Full-service spa with massage and beauty treatments",
  },
];

const HotelAmenities: React.FC = () => {
  return (
    <section className={styles.section} id="experience">
      <div className={styles.header}>
        <h2 className={styles.heading}>Hotel Amenities</h2>
        <p className={styles.subtitle}>
          Enjoy world-class facilities and services designed to make your stay exceptional
        </p>
      </div>

      <ul className={styles.grid}>
        {amenities.map((amenity, index) => (
          <li key={index} className={styles.amenityCard}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{amenity.icon}</span>
            </div>
            <h3 className={styles.amenityTitle}>{amenity.title}</h3>
            <p className={styles.amenityDescription}>{amenity.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelAmenities;
