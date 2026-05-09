import React from "react";
import { Link } from "react-router-dom";
import styles from './LatestNewsEvents.module.css';

type EventItem = {
  date: string;
  title: string;
  image: string;
  description: string;
  link: string;
};

const events: EventItem[] = [
  {
    date: "December 31, 2024",
    title: "New Year's Eve Gala Dinner",
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description:
      "Ring in the New Year with elegance and sophistication at Tango Hotel's exclusive Gala Dinner. Experience a meticulously crafted seven-course tasting menu by our Michelin-trained chef, complemented by premium champagne.",
    link: "/blog/new-years-eve-gala",
  },
  {
    date: "October 28, 2025",
    title: "Culinary Excellence: Wine Pairing Masterclass",
    image: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description:
      "Join our award-winning sommelier for an intimate evening exploring the art of wine pairing. Discover the perfect harmony between fine wines and artisanal cuisine through five expertly paired courses.",
    link: "/blog/wine-pairing-masterclass",
  },
  {
    date: "October 15, 2025",
    title: "Discover the Hidden Gems of the City",
    image: "https://www.atterbury.co.za/wp-content/uploads/2015/06/Lynnwood-bridge-featured-image.jpg",
    description:
      "Explore our curated guide to the city's most enchanting attractions, from centuries-old architecture to contemporary art galleries. Our concierge team shares insider recommendations for authentic local experiences.",
    link: "/blog/hidden-gems-guide",
  },
];

const LatestNewsEvents: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.ornamentalTop}></div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.decorativeLine}></div>
          <h1 className={styles.title}>Latest News & Events</h1>
          <p className={styles.subtitle}>
            Curated experiences and exclusive happenings at Tango Hotel
          </p>
        </div>

        <ul className={styles.eventsGrid}>
          {events.map((event, index) => (
            <li key={index} className={styles.eventCard}>
              <div className={styles.imageContainer}>
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.eventImage}
                />
                <div className={styles.imageOverlay}></div>
                <span className={styles.dateTag}>{event.date}</span>
              </div>
              <div className={styles.content}>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <p className={styles.description}>{event.description}</p>
                <Link to={event.link} className={styles.readMoreLink}>
                  <span>Read Full Article</span>
                  <span className={styles.arrow}>→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LatestNewsEvents;
