import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './Hero.module.css';

const slides = [
  {
    image:
      'https://cf.bstatic.com/xdata/images/hotel/max1024x768/587760525.jpg?k=ccea1db0b24721fb0011da27916c22a590fb9b1052ef27cccecdf3b20edaf516&o=',
    title: 'UNFORGETTABLE MOMENTS',
    subtitle:
      'Where every stay becomes a cherished memory with breathtaking views',
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 adults · 0 kids · 1 rooms');
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [guestCounts, setGuestCounts] = useState({ adults: 1, kids: 0, rooms: 1 });

  const updateGuests = (type: 'adults' | 'kids' | 'rooms', delta: number) => {
    setGuestCounts((prev) => {
      const updated = { ...prev, [type]: Math.max(0, prev[type] + delta) };
      return updated;
    });
  };

 useEffect(() => {
    setGuests(`${guestCounts.adults} adults · ${guestCounts.kids} kids · ${guestCounts.rooms} rooms`);
  }, [guestCounts]);

  const dateRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsApp(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateRef.current &&
        !dateRef.current.contains(event.target as Node)
      ) {
        setShowDateDropdown(false);
      }
      if (
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node)
      ) {
        setShowGuestsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className={styles.heroSection} id="home">
      <div className={styles.sliderContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ''
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.overlay}></div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.heroText}>
          <h1 className={styles.mainTitle}>{slides[currentSlide].title}</h1>
          <p className={styles.subtitle}>{slides[currentSlide].subtitle}</p>
          <button className={styles.ctaButton}>FIND OUT MORE</button>
        </div>

        
      </div>

      <div className={styles.searchBarContainer}>
        <div className={styles.searchBar}>
          

          <div className={styles.searchField} ref={dateRef}>
            <Calendar size={18} className={styles.fieldIcon} />
            <div className={styles.fieldContent}>
              <label className={styles.fieldLabel}>CHECK IN & CHECK-OUT DATES</label>
              <div
                className={styles.dropdownTrigger}
                onClick={() => setShowDateDropdown(!showDateDropdown)}
              >
                <span className={styles.dateSummary}>
                  {selectedRange?.from && selectedRange?.to
                    ? `${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}`
                    : 'Select dates'}
                </span>
                <ChevronDown size={16} className={styles.chevronIcon} />
              </div>
              {showDateDropdown && (
                <div className={styles.calendarDropdown}>
                  <div className={styles.dropdownPointer}></div>
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={setSelectedRange}
                    numberOfMonths={2}
                    defaultMonth={new Date()}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.searchField} ref={guestsRef}>
            <Users size={18} className={styles.fieldIcon} />
            <div className={styles.fieldContent}>
              <label className={styles.fieldLabel}>GUESTS & ROOMS</label>
              <div
                className={styles.dropdownTrigger}
                onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
              >
                <span className={styles.dateSummary}>{guests}</span>
                <ChevronDown size={16} className={styles.chevronIcon} />
              </div>
              {showGuestsDropdown && (
                <div className={styles.guestsDropdown}>
                  <div className={styles.guestsPointer}></div>
                  <div className={styles.guestsContent}>
                    <div className={styles.guestRow}>
                      <span className={styles.guestType}>ROOMS</span>
                      <div className={styles.counter}>
                        <button
                          className={styles.counterButton}
                          onClick={() => updateGuests('rooms', -1)}
                        >
                          -
                        </button>
                        <span className={styles.count}>{guestCounts.rooms}</span>
                        <button
                          className={styles.counterButton}
                          onClick={() => updateGuests('rooms', 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.guestRow}>
                      <span className={styles.guestType}>ADULT</span>
                      <div className={styles.counter}>
                        <button
                          className={styles.counterButton}
                          onClick={() => updateGuests('adults', -1)}
                        >
                          -
                        </button>
                        <span className={styles.count}>{guestCounts.adults}</span>
                        <button
                          className={styles.counterButton}
                          onClick={() => updateGuests('adults', 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.guestRow}>
                      <span className={styles.guestType}>KIDS</span>
                      <div className={styles.counter}>
                        <button
                          className={styles.counterButton}
                          onClick={() => updateGuests('kids', -1)}
                        >
                          -
                        </button>
                        <span className={styles.count}>{guestCounts.kids}</span>
                        <button
                          className={styles.counterButton}
                          onClick={() => updateGuests('kids', 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


          <button className={styles.checkButton}>CHECK AVAILABILITY</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
