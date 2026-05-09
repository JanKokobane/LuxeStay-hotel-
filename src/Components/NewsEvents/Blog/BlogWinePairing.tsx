import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import styles from "./BlogPost.module.css";

const BlogWinePairing: React.FC = () => {
  return (
    <div className={styles.blogPage}>
      <div className={styles.heroSection}>
        <img
          src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Wine Pairing Masterclass"
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
          <h1 className={styles.articleTitle}>Culinary Excellence: Wine Pairing Masterclass</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Calendar size={16} />
              October 28, 2025
            </span>
            <span className={styles.metaItem}>
              <Clock size={16} />
              7 min read
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.leadParagraph}>
            Discover the sophisticated art of wine pairing in an exclusive evening led by our award-winning sommelier. This intimate masterclass offers a rare opportunity to explore the intricate relationship between fine wines and artisanal cuisine, revealing the secrets behind creating truly memorable dining experiences.
          </p>

          <h2>A Journey Through Five Exceptional Pairings</h2>
          <p>
            This exclusive masterclass takes you on a sensory journey through five meticulously crafted courses, each paired with exceptional wines from renowned vineyards around the world. Our sommelier will guide you through the tasting, explaining the nuances of each pairing and the principles that make them work harmoniously together.
          </p>

          <p>
            From the bright acidity of a crisp Chablis paired with fresh oysters to the bold tannins of a Barolo complementing aged beef, each pairing demonstrates the transformative power of thoughtful wine selection. You'll learn how complementary and contrasting flavors can elevate both the wine and the food to new heights.
          </p>

          <h2>What You'll Learn</h2>
          <div className={styles.highlightBox}>
            <h3>Masterclass Curriculum</h3>
            <ul>
              <li>Professional wine tasting techniques and terminology</li>
              <li>Understanding wine regions and their distinctive characteristics</li>
              <li>The science behind successful food and wine pairings</li>
              <li>How to identify complementary and contrasting flavor profiles</li>
              <li>Reading wine labels and selecting quality bottles</li>
              <li>Building a versatile home wine collection</li>
              <li>Common pairing mistakes and how to avoid them</li>
            </ul>
          </div>

          <h2>Meet Your Expert Sommelier</h2>
          <p>
            Your evening will be led by Marcel Dubois, our Master Sommelier with over 20 years of experience in fine dining establishments across Europe and North America. Marcel has trained at prestigious institutions including the Court of Master Sommeliers and has curated wine programs for Michelin-starred restaurants.
          </p>

          <p>
            His passion for wine education and his engaging teaching style make complex concepts accessible to both beginners and enthusiasts. Marcel's extensive travels through wine regions worldwide bring authentic stories and insider knowledge to every tasting.
          </p>

          <h2>The Evening's Selection</h2>
          <p>
            While the exact wines and dishes vary seasonally to showcase the finest available ingredients, each masterclass features a carefully curated selection representing diverse wine regions and styles. Past selections have included:
          </p>

          <ul>
            <li>A crisp Sancerre from the Loire Valley paired with herb-crusted scallops</li>
            <li>An elegant white Burgundy complementing butter-poached lobster</li>
            <li>A medium-bodied Pinot Noir from Oregon with duck confit</li>
            <li>A bold Tuscan Super-Tuscan matched with aged ribeye</li>
            <li>A late-harvest Riesling alongside artisanal cheese and honeycomb</li>
          </ul>

          <h2>An Intimate Setting</h2>
          <p>
            To ensure a personalized and engaging experience, enrollment is limited to just 20 guests per session. This intimate setting allows for meaningful interaction with our sommelier, opportunities to ask questions, and the chance to connect with fellow wine enthusiasts.
          </p>

          <p>
            The masterclass takes place in our private wine cellar, an elegant space featuring floor-to-ceiling wine storage, exposed brick, and ambient lighting that creates the perfect atmosphere for learning and tasting.
          </p>

          <div className={styles.ctaBox}>
            <h3>Reserve Your Seat</h3>
            <p>Spaces are limited. Contact us at <strong>events@tangohotel.com</strong> or call <strong>+27 78 638 8679</strong></p>
            <p className={styles.priceNote}>R2500,00 per person | Duration: 3 hours</p>
          </div>

          <h2>Take Home Knowledge & Experience</h2>
          <p>
            Each participant receives a comprehensive tasting guide, pairing notes, and a curated list of recommended wines discussed during the evening. These materials serve as valuable references as you continue exploring the world of wine pairing at home.
          </p>

          <p>
            Whether you're a curious beginner or a passionate enthusiast, this masterclass offers insights and techniques that will transform the way you approach wine and dining. Join us for an evening of discovery, elegance, and unforgettable flavors.
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogWinePairing;
