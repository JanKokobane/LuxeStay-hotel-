import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import styles from "./BlogPost.module.css";

const BlogHiddenGems: React.FC = () => {
  return (
    <div className={styles.blogPage}>
      <div className={styles.heroSection}>
        <img
          src="https://www.atterbury.co.za/wp-content/uploads/2015/06/Lynnwood-bridge-featured-image.jpg"
          alt="Discover the Hidden Gems"
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
          <h1 className={styles.articleTitle}>Discover the Hidden Gems of the City</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Calendar size={16} />
              October 15, 2025
            </span>
            <span className={styles.metaItem}>
              <Clock size={16} />
              9 min read
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.leadParagraph}>
            Beyond the well-trodden tourist paths lies a city of extraordinary depth and character. Our expert concierge team has curated this exclusive guide to help you discover authentic experiences, artisan workshops, historic treasures, and culinary delights that even many locals have yet to uncover.
          </p>

          <h2>Architectural Marvels Off the Beaten Path</h2>
          <p>
            While the city's famous landmarks draw millions of visitors, some of its most stunning architectural achievements remain delightfully uncrowded. The Neo-Baroque Grand Theatre, tucked away in the Arts District, offers guided tours of its restored interior featuring hand-painted frescoes and original 19th-century craftsmanship.
          </p>

          <p>
            Don't miss the hidden courtyard gardens of the Old Merchant Quarter, where century-old buildings surround tranquil fountains and flowering vines cascade from wrought-iron balconies. These peaceful havens offer the perfect respite from the bustling streets outside.
          </p>

          <h2>Artisan Workshops & Local Crafts</h2>
          <div className={styles.highlightBox}>
            <h3>Must-Visit Artisan Experiences</h3>
            <ul>
              <li><strong>Bottega Leone</strong> - Fourth-generation leather craftsmen creating bespoke bags and accessories</li>
              <li><strong>Atelier Céramique</strong> - Contemporary pottery studio offering hands-on workshops</li>
              <li><strong>Maison du Parfum</strong> - Boutique perfumery where you can create custom fragrances</li>
              <li><strong>Goldsmith's Quarter</strong> - Historic district filled with jewelry artisans and antique dealers</li>
            </ul>
          </div>

          <p>
            Each Wednesday and Saturday, the Artisan Market comes alive in the historic Piazza dell'Arte, where local craftspeople showcase handmade textiles, ceramics, woodwork, and more. Arrive early for the best selection and the opportunity to meet the artists behind the work.
          </p>

          <h2>Culinary Discoveries</h2>
          <p>
            The city's culinary scene extends far beyond its famous restaurants. Venture into the Riverside District to discover family-run trattorias that have been serving traditional recipes for generations. At Osteria Nonna, the menu changes daily based on what's fresh at the morning market, and reservations are essential despite its modest appearance.
          </p>

          <p>
            For an unforgettable breakfast experience, visit Café Lumière, a century-old coffee house where skilled baristas still prepare coffee using vintage equipment. Pair your espresso with fresh-baked cornetti filled with seasonal fruit preserves.
          </p>

          <h2>Contemporary Art Galleries</h2>
          <p>
            Art enthusiasts will find a thriving contemporary scene in the converted warehouses of the Port District. Gallery 51 specializes in emerging local artists, while the Industrial Art Space hosts rotating exhibitions in a stunning venue featuring exposed brick, soaring ceilings, and natural light.
          </p>

          <p>
            First Friday of each month, the Art District organizes a gallery walk with openings, artist talks, and complimentary wine tastings. It's an excellent opportunity to explore multiple spaces and engage with the creative community.
          </p>

          <h2>Scenic Walking Tours</h2>
          <p>
            Experience the city's character on foot with these carefully curated walking routes:
          </p>

          <div className={styles.highlightBox}>
            <h3>Recommended Walking Routes</h3>
            <ul>
              <li><strong>The Riverside Heritage Walk</strong> - 2.5 hours exploring historic waterfront architecture and hidden gardens</li>
              <li><strong>The Artisan Quarter Loop</strong> - 1.5 hours through cobblestone streets lined with workshops and boutiques</li>
              <li><strong>The Literary Trail</strong> - 2 hours visiting historic cafés and bookshops frequented by famous authors</li>
              <li><strong>The Sunset Panorama Route</strong> - 1 hour to the best viewpoints for evening photography</li>
            </ul>
          </div>

          <h2>Exclusive Tango Hotel Guest Benefits</h2>
          <p>
            As a valued guest of Tango Hotel, you receive special privileges at many partner establishments throughout the city:
          </p>

          <ul>
            <li>15% discount at featured artisan workshops and galleries</li>
            <li>Priority reservations at recommended restaurants</li>
            <li>Complimentary admission to select museums on weekdays</li>
            <li>Private guided tours with our expert local historians</li>
            <li>Curated welcome package with neighborhood maps and insider tips</li>
          </ul>

          <h2>Seasonal Highlights</h2>
          <p>
            Each season brings unique experiences to discover. Spring ushers in the Cherry Blossom Festival in Botanical Gardens, while summer features open-air concerts in historic squares. Autumn's Harvest Festival showcases regional wines and local produce, and winter transforms the Old Town into a magical wonderland with artisan Christmas markets.
          </p>

          <div className={styles.ctaBox}>
            <h3>Plan Your Perfect Day</h3>
            <p>Our concierge team is available 24/7 to help plan your explorations, arrange reservations, and provide insider recommendations tailored to your interests.</p>
            <p>Contact us at <strong>concierge@tangohotel.com</strong> or visit the front desk</p>
          </div>

          <h2>Local Transportation Tips</h2>
          <p>
            While many attractions are within walking distance of Tango Hotel, the city's efficient metro system makes exploring further neighborhoods effortless. Consider purchasing a multi-day transit pass for unlimited access to metros and buses. For a more leisurely pace, the city's bike-share program offers stations throughout major districts.
          </p>

          <p>
            Taxis and ride-sharing services are readily available, though we recommend experiencing the charm of the vintage tram line that circles the historic center, offering a mobile sightseeing experience.
          </p>

          <p>
            The city's true magic reveals itself to those who venture beyond the obvious. With this guide and the expertise of our concierge team, you're equipped to discover experiences that will make your visit truly unforgettable. Let Tango Hotel be your gateway to authentic exploration and extraordinary memories.
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogHiddenGems;
