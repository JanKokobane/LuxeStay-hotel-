import React from "react";
import styles from "./AboutUs.module.css";
import aboutUsImage from "../../assets/AboutPic.png";

const AboutUs: React.FC = () => {
  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.imageWrapper}>
        <img src={aboutUsImage} alt="About Tango Hotel" className={styles.aboutImage} />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Our Hotel</h2>
        <p className={styles.description}>
          Tango Hotel is a sanctuary of sophistication nestled in the heart of the city. We offer a curated blend of elegance and comfort, designed for discerning travelers who value exceptional service, refined spaces, and seamless convenience.
        </p>
        <p className={styles.description}>
          From our luxury suites to our executive rooms, every detail is crafted to elevate your stay. Guests enjoy high-speed WiFi, gourmet dining, private meeting lounges, and attentive hospitality that reflects our commitment to excellence. Whether you're here for business or leisure, Tango Hotel is your effortless escape.
        </p>

      </div>
    </section>
  );
};

export default AboutUs;
