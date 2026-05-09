import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import styles from "./BlogPost.module.css";

const BlogNewYearsGala: React.FC = () => {
  return (
    <div className={styles.blogPage}>
      <div className={styles.heroSection}>
        <img
          src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="New Year's Eve Gala Dinner"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}></div>
      </div>

      <article className={styles.article}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to News & Events</span>
        </Link>

        <div className={styles.articleHeader}>
          <div className={styles.decorativeLine}></div>
          <h1 className={styles.articleTitle}>New Year's Eve Gala Dinner</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Calendar size={16} />
              December 31, 2024
            </span>
            <span className={styles.metaItem}>
              <Clock size={16} />
              8 min read
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.leadParagraph}>
            As the year draws to a close, Tango Hotel invites you to celebrate in unparalleled elegance. Our New Year's Eve Gala Dinner represents the pinnacle of luxury dining, combining world-class cuisine, sophisticated ambiance, and unforgettable entertainment to create an evening that will be remembered for years to come.
          </p>

          <h2>An Evening of Culinary Artistry</h2>
          <p>
            Our Michelin-trained Executive Chef has crafted an extraordinary seven-course tasting menu that showcases the finest seasonal ingredients sourced from local artisans and international purveyors. Each course is a masterpiece, thoughtfully designed to delight the senses and take guests on a gastronomic journey through flavors, textures, and aromas.
          </p>

          <p>
            Begin your evening with delicate canapés featuring Ossetra caviar, followed by courses that include seared foie gras with fig compote, truffle-infused lobster bisque, and perfectly aged Wagyu beef. The menu concludes with an exquisite selection of artisanal cheeses and a decadent champagne-infused dessert creation.
          </p>

          <h2>Premium Champagne & Wine Selection</h2>
          <p>
            Complementing each course is a carefully selected premium champagne or wine pairing, curated by our award-winning sommelier. From rare vintage champagnes to distinguished bordeaux, each pour has been chosen to enhance the flavors of the cuisine and elevate your dining experience.
          </p>

          <div className={styles.highlightBox}>
            <h3>Evening Schedule</h3>
            <ul>
              <li><strong>7:30 PM</strong> - Welcome reception with champagne and canapés</li>
              <li><strong>8:30 PM</strong> - Seven-course dinner service begins</li>
              <li><strong>10:30 PM</strong> - Live jazz ensemble performance</li>
              <li><strong>11:00 PM</strong> - Ballroom dancing with live music</li>
              <li><strong>11:55 PM</strong> - Countdown celebration</li>
              <li><strong>Midnight</strong> - Spectacular rooftop fireworks display</li>
              <li><strong>12:30 AM</strong> - Late-night dessert bar and cocktails</li>
            </ul>
          </div>

          <h2>Live Entertainment & Ambiance</h2>
          <p>
            Throughout the evening, our grand ballroom will come alive with the sounds of a world-class jazz ensemble, featuring acclaimed musicians who have performed at venues around the globe. As midnight approaches, guests are invited to the dance floor for an elegant ballroom dancing experience.
          </p>

          <p>
            At the stroke of midnight, join us on our exclusive rooftop terrace for a breathtaking fireworks display choreographed to music, offering panoramic views of the city skyline as the new year begins in spectacular fashion.
          </p>

          <h2>Dress Code & Reservations</h2>
          <p>
            Black-tie optional attire is requested to maintain the sophisticated atmosphere of the evening. We encourage guests to embrace the elegance of the occasion.
          </p>

          <p>
            Due to the intimate nature of this exclusive event, seating is strictly limited. We recommend making reservations at your earliest convenience to secure your place at what promises to be the city's most prestigious New Year's Eve celebration.
          </p>

          <div className={styles.ctaBox}>
            <h3>Reserve Your Experience</h3>
            <p>Contact our concierge team at <strong>reservations@tangohotel.com</strong> or call <strong>+27 78 638 8679</strong></p>
            <p className={styles.priceNote}>Starting at R3800,00 per person</p>
          </div>

          <p>
            Ring in 2024 with sophistication, elegance, and memories that will last a lifetime. We look forward to welcoming you to Tango Hotel for an unforgettable New Year's Eve celebration.
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogNewYearsGala;
