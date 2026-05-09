import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import styles from "./ContactUs.module.css";

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
      alert("Thank you for your message! We'll get back to you soon.");
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}>Get In Touch</h2>
          <p className={styles.subtitle}>
            We'd love to hear from you. Our team is ready to assist with your
            inquiries and reservations.
          </p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.0489837634744!2d28.28156!3d-25.76703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9560e1e1c1c1c1%3A0x1c1c1c1c1c1c1c1c!2sLynwood%2C%20Pretoria!5e0!3m2!1sen!2sza!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lynwood Hotel Location"
              ></iframe>
            </div>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}><span className={styles.moveIcon}><MapPin className={styles.icon} /></span> Location</h3>
                  <p className={styles.infoText}>Lynwood Manor</p>
                  <p className={styles.infoText}>Pretoria, Gauteng</p>
                  <p className={styles.infoText}>South Africa</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}>
                  <Phone className={styles.icon} /> Phone</h3>
                  <p className={styles.infoText}>078 638 8679</p>
                  <p className={styles.infoTextSecondary}>Available 24/7</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}><Mail className={styles.icon} /> Email</h3>
                  <p className={styles.infoText}>info@luxestay.com</p>
                  <p className={styles.infoTextSecondary}>reservations@luxestay.com</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}><Clock className={styles.icon} />Reception Hours</h3>
                  <p className={styles.infoText}>24 Hours Daily</p>
                  <p className={styles.infoTextSecondary}>Check-in: 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Send Us a Message</h3>
              <p className={styles.formSubtitle}>
                Fill out the form below and we'll respond within 24 hours
              </p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Please Enteer Full Name"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="user@mail.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="+27 12 345 6789"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Tell us about your inquiry or special requests..."
                    rows={6}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className={styles.buttonIcon} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
