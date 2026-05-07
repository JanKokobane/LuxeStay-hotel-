import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelApi, bookingApi } from '../api';
import { Calendar, User, Clock, ShieldCheck, Mail, Phone, Info, ChevronLeft, Check, Plane, Car, Truck, MessageSquare, AlertCircle, Globe } from 'lucide-react';
import { differenceInDays, parseISO, format, isValid } from 'date-fns';
import styles from './Booking.module.css';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'South Africa',
    isMainGuest: true,
    isWorkTrip: false,
    specialRequests: '',
    arrivalTime: '14:00 - 15:00',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    async function loadHotel() {
      try {
        const data = await hotelApi.getHotel(id!);
        setHotel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, [id]);

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut && hotel) {
      const start = parseISO(bookingData.checkIn);
      const end = parseISO(bookingData.checkOut);
      
      if (isValid(start) && isValid(end) && end > start) {
        const diff = differenceInDays(end, start);
        setNights(diff);
        setTotalPrice(diff * hotel.price);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, hotel]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Clear previous errors
    const newErrors: Record<string, string> = {};

    // Basic required field validation
    if (!bookingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!bookingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!validateEmail(bookingData.email)) newErrors.email = 'Please enter a valid email address';
    if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!bookingData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!bookingData.checkOut) newErrors.checkOut = 'Check-out date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!token) {
      navigate('/auth');
      return;
    }

    if (nights <= 0) {
      newErrors.dates = "Please select valid check-in and check-out dates.";
      setErrors(newErrors);
      return;
    }

    // Navigate to payment page with booking state
    navigate(`/payment/${id}`, { 
      state: { 
        ...bookingData, 
        totalPrice, 
        nights,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        stars: hotel.stars,
        distance: hotel.distance
      } 
    });
  };

  if (loading) return <div className={styles.loadingContainer}>Preparing your reservation...</div>;
  if (!hotel) return <div className={styles.errorContainer}>Room not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backLink}
        >
          <ChevronLeft size={16} /> Back to details
        </button>

        <div className={styles.mainGrid}>
          {/* Left Column: Form Sections */}
          <div className={styles.leftCol}>
            
            {/* 1. Details Section */}
            <section className={styles.section}>
              <div>
                <h2>Enter your details</h2>
                <div className={styles.infoBanner}>
                  <Info size={18} />
                  <p>Almost done! Just fill in the <span>*</span> required info</p>
                </div>
              </div>
              
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>First Name*</label>
                    <div className={styles.relative}>
                      <User className={`${styles.inputIcon} ${errors.firstName ? styles.inputIconError : ''}`} size={18} />
                      <input 
                        type="text" 
                        name="firstName"
                        required 
                        className={`${styles.inputField} ${errors.firstName ? styles.inputFieldError : ''}`} 
                        onChange={(e) => {
                          setBookingData({...bookingData, firstName: e.target.value});
                          if (errors.firstName) setErrors({...errors, firstName: ''});
                        }}
                      />
                    </div>
                    {errors.firstName && <p className={styles.errorMessage}>{errors.firstName}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name*</label>
                    <div className={styles.relative}>
                      <User className={`${styles.inputIcon} ${errors.lastName ? styles.inputIconError : ''}`} size={18} />
                      <input 
                        type="text" 
                        name="lastName"
                        required 
                        className={`${styles.inputField} ${errors.lastName ? styles.inputFieldError : ''}`} 
                        onChange={(e) => {
                          setBookingData({...bookingData, lastName: e.target.value});
                          if (errors.lastName) setErrors({...errors, lastName: ''});
                        }}
                      />
                    </div>
                    {errors.lastName && <p className={styles.errorMessage}>{errors.lastName}</p>}
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.mb2rem}`}>
                  <label>Email Address*</label>
                  <div className={styles.relative}>
                    <Mail className={`${styles.inputIcon} ${errors.email ? styles.inputIconError : ''}`} size={18} />
                    <input 
                      type="email" 
                      name="email"
                      required 
                      className={`${styles.inputField} ${errors.email ? styles.inputFieldError : ''}`} 
                      onChange={(e) => {
                        setBookingData({...bookingData, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                    />
                  </div>
                  {errors.email ? (
                    <p className={styles.errorMessage}>{errors.email}</p>
                  ) : (
                    <p className={styles.inputHint}>Confirmation email sent to this address</p>
                  )}
                </div>
                
                <div className={`${styles.formGrid} ${styles.mb25rem}`}>
                  <div className={styles.formGroup}>
                    <label>Country/Region*</label>
                    <div className={styles.relative}>
                      <Globe className={styles.inputIcon} size={18} />
                      <select 
                        className={`${styles.inputField} ${styles.countrySelect}`} 
                        defaultValue="South Africa"
                        onChange={(e) => setBookingData({...bookingData, country: e.target.value})}
                      >
                        <option>South Africa</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                        <option>France</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number*</label>
                    <div className={styles.phoneGrid}>
                      <div className={styles.countryCode}>
                        +27
                      </div>
                      <div className={`${styles.relative} ${styles.flex1}`}>
                        <Phone className={`${styles.inputIcon} ${errors.phone ? styles.inputIconError : ''}`} size={18} />
                        <input 
                          type="tel" 
                          name="phone"
                          required 
                          className={`${styles.inputField} ${errors.phone ? styles.inputFieldError : ''}`} 
                          placeholder="Phone number" 
                          onChange={(e) => {
                            setBookingData({...bookingData, phone: e.target.value});
                            if (errors.phone) setErrors({...errors, phone: ''});
                          }}
                        />
                      </div>
                    </div>
                    {errors.phone ? (
                      <p className={styles.errorMessage}>{errors.phone}</p>
                    ) : (
                      <p className={styles.inputHintMuted}>To verify your booking, and for the property to connect if needed</p>
                    )}
                  </div>
                </div>

              <div className={styles.checkboxBanner}>
                <input type="checkbox" className={styles.checkboxInput} defaultChecked />
                <div className={styles.checkboxText}>
                  <p>Yes, I want free paperless confirmation (recommended)</p>
                  <p>We'll text you a link to download our app</p>
                </div>
              </div>

              <div>
                <div className={styles.radioGroup}>
                  <p>Who are you booking for?</p>
                  <div className={styles.radioOptions}>
                    <button 
                      type="button"
                      onClick={() => setBookingData({...bookingData, isMainGuest: true})}
                      className={`${styles.primaryBtn} ${bookingData.isMainGuest ? styles.btnActive : styles.btnInactive}`}
                    >
                      I'm the main guest
                    </button>
                    <button 
                      type="button"
                      onClick={() => setBookingData({...bookingData, isMainGuest: false})}
                      className={`${styles.primaryBtn} ${!bookingData.isMainGuest ? styles.btnActive : styles.btnInactive}`}
                    >
                      I'm booking for someone else
                    </button>
                  </div>
                </div>

                <div className={`${styles.radioGroup} ${styles.mb0}`}>
                  <p>Are you traveling for work?</p>
                  <div className={styles.radioOptions}>
                    <label className={styles.radioSimple}>
                      <input 
                        type="radio" 
                        name="work" 
                        className={styles.radioInput} 
                        onChange={() => setBookingData({...bookingData, isWorkTrip: true})}
                        checked={bookingData.isWorkTrip}
                      />
                      <span>Yes</span>
                    </label>
                    <label className={styles.radioSimple}>
                      <input 
                        type="radio" 
                        name="work" 
                        className={styles.radioInput} 
                        onChange={() => setBookingData({...bookingData, isWorkTrip: false})}
                        checked={!bookingData.isWorkTrip}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Good to know */}
            <section className={styles.section}>
              <div className={`${styles.categoryTitle} ${styles.mb15rem} ${styles.flexCenter}`}>
                <AlertCircle size={24} /> <h3 className={styles.h2TabTitle}>Good to know:</h3>
              </div>
              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  <Check size={20} />
                  <p>
                    <span>Stay flexible:</span> You can cancel for free before May 22, 2026 – lock in this great price today.
                  </p>
                </div>
                <div className={styles.bulletItem}>
                  <Check size={20} />
                  <p>
                    You'll get the entire suite to yourself!
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Suite Details */}
            <section className={styles.section}>
              <div className={styles.flexBetween}>
                <div>
                  <h3 className={styles.h3HotelName}>{hotel.name}</h3>
                  <div className={styles.badge}>
                    <ShieldCheck size={14} /> Free cancellation before May 22, 2026
                  </div>
                </div>
              </div>

              <div className={styles.bulletList}>
                <div className={styles.guestInfo}>
                  <User color="#94a3b8" size={20} />
                  <div className={styles.guestDetail}>
                    <p>Guests: 2 adults, 2 children (10 and 11 years old)</p>
                    <button className={styles.linkBtn}>Add main guest details</button>
                  </div>
                </div>
                <div className={styles.noSmoking}>
                  <Info size={18} /> No smoking in room
                </div>
              </div>
            </section>

            {/* 4. Add to your stay */}
            <section className={styles.section}>
              <h3 className={styles.h3Title}>Add to your stay</h3>
              
              <div className={styles.upsellList}>
                <div className={styles.upsellItem}>
                  <div className={styles.upsellIcon}>
                    <Plane size={28} />
                  </div>
                  <div className={styles.upsellContent}>
                    <div className={styles.upsellTitleRow}>
                      <span className={styles.upsellTitle}>I’ll need a flight for my trip</span>
                      <input type="checkbox" className={`${styles.radioInput} ${styles.upsellCheckbox}`} />
                    </div>
                    <p className={styles.upsellDesc}>
                      Flexible flight options from Johannesburg to Port Elizabeth starting at <span className={styles.boldNavy}>ZAR 4,362</span> round-trip. Finish booking this stay to get flight recommendations that match your selected dates.
                    </p>
                  </div>
                </div>

                <div className={styles.upsellItem}>
                  <div className={styles.upsellIcon}>
                    <Car size={28} />
                  </div>
                  <div className={styles.upsellContent}>
                    <div className={styles.upsellTitleRow}>
                      <span className={styles.upsellTitle}>I’m interested in renting a car with 5% off</span>
                      <input type="checkbox" className={`${styles.radioInput} ${styles.upsellCheckbox}`} />
                    </div>
                    <p className={styles.upsellDesc}>
                      Save 5% on all rental cars when you book with us – we'll add car rental options to your booking confirmation.
                    </p>
                  </div>
                </div>

                <div className={styles.upsellItem}>
                  <div className={styles.upsellIcon}>
                    <Truck size={28} />
                  </div>
                  <div className={styles.upsellContent}>
                    <div className={styles.upsellTitleRow}>
                      <span className={styles.upsellTitle}>Want to book a taxi or shuttle ride in advance?</span>
                      <input type="checkbox" className={`${styles.radioInput} ${styles.upsellCheckbox}`} />
                    </div>
                    <p className={styles.upsellDesc}>
                      Avoid surprises – get from the airport to your accommodations without any hassle. We'll add taxi options to your booking confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Special Requests */}
            <section className={styles.section}>
              <div className={styles.titleRow}>
                <MessageSquare size={28} /> <h3 className={`${styles.h3Title} ${styles.mb0}`}>Special requests</h3>
              </div>
              <p className={`${styles.greyText} ${styles.mb15rem}`}>
                Special requests can't be guaranteed, but the property will do its best to meet your needs. You can always make a special request after your booking is complete.
              </p>
              <div className={styles.formGroup}>
                <label>Please write your requests in English. (optional)</label>
                <textarea 
                  className={`${styles.inputField} ${styles.textarea}`} 
                  placeholder="e.g. Early check-in, dietary requirements..."
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                ></textarea>
              </div>
            </section>

            {/* 6. Arrival Time */}
            <section className={styles.section}>
              <div className={styles.arrivalSectionHeader}>
                <Clock size={28} /> <h3 className={`${styles.h3Title} ${styles.mb0}`}>Your arrival time</h3>
              </div>
              <div className={styles.checkinNote}>
                <Check size={18} />
                <p>You can check in between 2:00 PM and 7:00 PM</p>
              </div>

              <div className={styles.formGroup}>
                <label>Add your estimated arrival time (optional)</label>
                <select 
                  className={styles.inputField}
                  onChange={(e) => setBookingData({...bookingData, arrivalTime: e.target.value})}
                >
                  <option>14:00 - 15:00</option>
                  <option>15:00 - 16:00</option>
                  <option>16:00 - 17:00</option>
                  <option>17:00 - 18:00</option>
                  <option>18:00 - 19:00</option>
                </select>
              </div>
            </section>
          </div>

          {/* Right Column: Price Summary & Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryImage}>
                <img src={hotel.image} alt={hotel.name} />
                <div className={styles.starTag}>
                  {hotel.stars} Stars
                </div>
              </div>
              
              <div className={styles.summaryInfo}>
                <h3>{hotel.name}</h3>
                <p>{hotel.distance}</p>

                <div className={styles.dateGrid}>
                  <div className={styles.dateField}>
                    <label>Check-in</label>
                    <div className={styles.relative}>
                      <Calendar className={`${styles.inputIcon} ${errors.checkIn ? styles.inputIconError : ''} ${styles.iconLeft1}`} size={14} />
                      <input 
                        type="date" 
                        name="checkIn"
                        required
                        className={`${styles.dateInput} ${errors.checkIn ? styles.dateInputError : ''}`}
                        onChange={(e) => {
                          setBookingData({...bookingData, checkIn: e.target.value});
                          if (errors.checkIn) setErrors({...errors, checkIn: ''});
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.dateField}>
                    <label>Check-out</label>
                    <div className={styles.relative}>
                      <Calendar className={`${styles.inputIcon} ${errors.checkOut ? styles.inputIconError : ''} ${styles.iconLeft1}`} size={14} />
                      <input 
                        type="date" 
                        name="checkOut"
                        required
                        className={`${styles.dateInput} ${errors.checkOut ? styles.dateInputError : ''}`}
                        onChange={(e) => {
                          setBookingData({...bookingData, checkOut: e.target.value});
                          if (errors.checkOut) setErrors({...errors, checkOut: ''});
                        }}
                      />
                    </div>
                  </div>
                </div>

                {nights > 0 && (
                  <div className={styles.nightsRow}>
                    <span className={styles.nightCount}>{nights} night{nights > 1 ? 's' : ''}</span>
                    <span className={styles.nightPrice}>R {hotel.price * nights}</span>
                  </div>
                )}
                
                <div className={styles.totalSection}>
                  <p className={styles.totalLabel}>Total Amount</p>
                  <p className={styles.totalValue}>R {totalPrice}</p>
                </div>

                <div className={styles.mt25rem}>
                  <button 
                    onClick={handleContinueToPayment}
                    className={styles.confirmBtn}
                  >
                    Confirm Booking
                  </button>
                  <p className={styles.confirmNote}>
                    Proceed to secure payment
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.trustBanner}>
              <div className={styles.trustIcon}>
                <ShieldCheck size={24} />
              </div>
              <div className={styles.trustText}>
                <span>Secure Choice</span>
                <span>Instant confirmation & protection</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
