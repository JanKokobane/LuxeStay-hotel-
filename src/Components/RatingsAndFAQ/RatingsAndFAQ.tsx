import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './RatingsAndFAQ.module.css';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  roomType: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "David Mdiga",
    rating: 5,
    date: "March 2025",
    comment: "Absolutely wonderful stay at Tango Hotel! The staff was incredibly friendly and the room was spotless. The breakfast buffet exceeded our expectations.",
    roomType: "Deluxe Room"
  },
  {
    id: 2,
    name: "Mpho Molefe",
    rating: 5,
    date: "February 2025",
    comment: "Perfect location in Pretoria with easy access to everything. The Executive Suite was luxurious and the spa facilities were outstanding. Highly recommend!",
    roomType: "Executive Suite"
  },
  {
    id: 3,
    name: "Lilian Masha",
    rating: 4,
    date: "January 2025",
    comment: "Great hotel for families! The Family Room was spacious and comfortable. Kids loved the pool. Only minor issue was slow WiFi in the evenings.",
    roomType: "Family Room"
  },
  {
    id: 4,
    name: "David Goden",
    rating: 5,
    date: "December 2024",
    comment: "Stayed here for a business conference. The Business Room had everything I needed - excellent desk setup and fast internet. Conference facilities were top-notch.",
    roomType: "Business Room"
  }
];

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What are the check-in and check-out times?",
    answer: "Check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability and additional charges."
  },
  {
    id: 2,
    question: "Is parking available at Tandgo Hotel?",
    answer: "Yes, we offer complimentary on-site parking for all our guests. Valet parking service is also available for a small fee."
  },
  {
    id: 3,
    question: "Do you offer airport shuttle service?",
    answer: "Yes, we provide airport transfer services to and from OR Tambo International Airport. Please contact our concierge at least 24 hours in advance to arrange pickup."
  },
  {
    id: 4,
    question: "Are pets allowed at the hotel?",
    answer: "Yes, we are a pet-friendly hotel! Small pets (under 15kg) are welcome in designated rooms with a one-time cleaning fee of R300. Please inform us during booking."
  },
  {
    id: 5,
    question: "What amenities are included in the rooms?",
    answer: "All rooms include free WiFi, flat-screen TV, mini-bar, safe, air conditioning, premium bedding, and complimentary toiletries. Deluxe rooms and suites include additional amenities."
  },
  {
    id: 6,
    question: "Is breakfast included in the room rate?",
    answer: "Breakfast is included with most room bookings. We offer a full buffet breakfast served daily from 6:30 AM to 10:30 AM in our main restaurant."
  },
  {
    id: 7,
    question: "What is your cancellation policy?",
    answer: "Free cancellation is available up to 48 hours before check-in. Cancellations made within 48 hours of arrival will be charged one night's accommodation fee."
  },
  {
    id: 8,
    question: "Do you have conference and event facilities?",
    answer: "Yes, we have multiple conference rooms and event spaces that can accommodate 10-200 guests. Our events team can assist with catering, AV equipment, and custom arrangements."
  }
];

const RatingsAndFAQ: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        className={index < rating ? styles.starFilled : styles.starEmpty}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <section className={styles.section}>
      <div className={styles.ratingsSection}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Guest Reviews</h2>
          <p className={styles.description}>
            See what our guests have to say about their experience at Tandgo Hotel
          </p>
        </div>

        {/* <div className={styles.ratingSummary}>
          <div className={styles.ratingScore}>
            <span className={styles.scoreNumber}>{averageRating.toFixed(1)}</span>
            <div className={styles.starsWrapper}>
              {renderStars(Math.round(averageRating))}
            </div>
            <span className={styles.reviewCount}>Based on {totalReviews} reviews</span>
          </div>
        </div> */}

        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div>
                  <h3 className={styles.reviewerName}>{review.name}</h3>
                  <p className={styles.roomType}>{review.roomType}</p>
                </div>
                <span className={styles.reviewDate}>{review.date}</span>
              </div>
              <div className={styles.reviewStars}>
                {renderStars(review.rating)}
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.faqSection}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Frequently Asked Questions</h2>
          <p className={styles.description}>
            Find answers to common questions about your stay at Tango Hotel
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={expandedFAQ === faq.id}
              >
                <span>{faq.question}</span>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className={styles.chevron} />
                ) : (
                  <ChevronDown className={styles.chevron} />
                )}
              </button>
              {expandedFAQ === faq.id && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RatingsAndFAQ;
