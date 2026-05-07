import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bookingApi } from '../api';
import { 
  ChevronLeft, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Info, 
  Check, 
  Calendar, 
  Users, 
  MapPin, 
  ArrowRight, 
  User, 
  Receipt, 
  Sparkles,
  Mail 
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import styles from './Payment.module.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const bookingState = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [payWhen, setPayWhen] = useState('online');
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [processingStatus, setProcessingStatus] = useState('Securing connection...');
  const [orderRef] = useState(`LXS-${Math.floor(100000 + Math.random() * 900000)}`);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    if (paymentStep === 'success') {
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/confirmation');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentStep, navigate]);

  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardDetails.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";
    
    const cleanCard = cardDetails.cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanCard)) newErrors.cardNumber = "Invalid card number (16 digits required)";
    
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)";
    }
    
    if (!/^\d{3,4}$/.test(cardDetails.cvc)) newErrors.cvc = "Invalid CVC";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setLoading(true);
    setPaymentStep('processing');
    
    // Status update intervals for professional feel
    const statuses = [
      'Securing connection...',
      'Verifying card details...',
      'Authorizing transaction...',
      'Finalizing reservation...'
    ];
    
    statuses.forEach((status, index) => {
      setTimeout(() => setProcessingStatus(status), index * 600);
    });
    
    // Final completion
    setTimeout(async () => {
      try {
        await bookingApi.createBooking({
          hotelId: parseInt(id!),
          checkIn: bookingState.checkIn,
          checkOut: bookingState.checkOut,
          guests: bookingState.guests,
          totalPrice: bookingState.totalPrice,
        });
        
        setPaymentStep('success');
        
        // Trigger professional confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0f172a', '#10b981', '#3b82f6', '#f59e0b']
        });

      } catch (err: any) {
        alert(err.message);
        setLoading(false);
        setPaymentStep('idle');
      }
    }, 2500);
  };

  if (!bookingState.totalPrice) {
    return (
      <div className={styles.noDataContainer}>
        <p className={styles.noDataText}>No booking details found.</p>
        <button onClick={() => navigate('/')} className={styles.homeBtn}>Go back home</button>
      </div>
    );
  }

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
          {/* Main Payment Column */}
          <div className={styles.mainCol}>
            
            {/* Section 1: When do you want to pay? */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNumber}>1</span>
                When do you want to pay?
              </h2>
              
              <div className={styles.payOptions}>
                <label className={`${styles.payLabel} ${payWhen === 'online' ? styles.payLabelActive : ''}`}>
                  <div className={styles.pt1}>
                    <input 
                      type="radio" 
                      name="payWhen" 
                      checked={payWhen === 'online'} 
                      onChange={() => setPayWhen('online')}
                      className={styles.radioInput} 
                    />
                  </div>
                  <div className={styles.payText}>
                    <p className={styles.payTitle}>
                      Pay on {format(new Date(), 'MMMM dd')} 
                      <span className={styles.flexibleBadge}>Flexible</span>
                    </p>
                    <p className={styles.payDesc}>
                      LuxeStay will facilitate your payment. We'll automatically charge your selected card on the check-in date.
                    </p>
                  </div>
                </label>

                <label className={`${styles.payLabel} ${payWhen === 'now' ? styles.payLabelActive : ''}`}>
                  <div className={styles.pt1}>
                    <input 
                      type="radio" 
                      name="payWhen" 
                      checked={payWhen === 'now'} 
                      onChange={() => setPayWhen('now')}
                      className={styles.radioInput} 
                    />
                  </div>
                  <div className={styles.payText}>
                    <p className={styles.payTitle}>Pay now</p>
                    <p className={styles.payDesc}>
                      You'll pay the full amount now to secure your stay immediately.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Section 2: How do you want to pay? */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNumber}>2</span>
                How do you want to pay?
              </h2>
              
              <div className={styles.methodGrid}>
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`${styles.methodBtn} ${paymentMethod === 'card' ? styles.methodBtnActive : ''}`}
                >
                  <CreditCard size={28} className={`${styles.methodIcon} ${paymentMethod === 'card' ? styles.methodIconActive : ''}`} />
                  <span className={`${styles.methodText} ${paymentMethod === 'card' ? styles.methodTextActive : ''}`}>New card</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('google')}
                  className={`${styles.methodBtn} ${paymentMethod === 'google' ? styles.methodBtnActive : ''}`}
                >
                  <div className={`${styles.gPayText} ${paymentMethod === 'google' ? styles.gPayTextActive : ''}`}>G Pay</div>
                  <span className={`${styles.methodText} ${paymentMethod === 'google' ? styles.methodTextActive : ''}`}>Google Pay</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <form id="payment-form" onSubmit={handleCompleteBooking} className={styles.cardForm}>
                  <div className={`${styles.formGroup} ${styles.mb15}`}>
                    <label className={styles.formLabel}>Cardholder's name *</label>
                    <div className={styles.relative}>
                      <User className={`${styles.inputIcon} ${errors.cardholderName ? styles.inputIconError : ''}`} size={18} />
                      <input 
                        type="text" 
                        required 
                        className={`${styles.inputField} ${errors.cardholderName ? styles.inputFieldError : ''}`} 
                        placeholder="e.g. James Make"
                        value={cardDetails.cardholderName}
                        onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                      />
                    </div>
                    {errors.cardholderName && <p className={styles.errorText}>{errors.cardholderName}</p>}
                  </div>
                  <div className={`${styles.formGroup} ${styles.mb15}`}>
                    <label className={styles.formLabel}>Card number *</label>
                    <div className={styles.relative}>
                      <CreditCard className={`${styles.inputIcon} ${errors.cardNumber ? styles.inputIconError : ''}`} size={18} />
                      <input 
                        type="text" 
                        required 
                        className={`${styles.inputField} ${errors.cardNumber ? styles.inputFieldError : ''}`} 
                        placeholder="0000 0000 0000 0000"
                        value={cardDetails.cardNumber}
                        maxLength={19}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          val = val.replace(/(.{4})/g, '$1 ').trim();
                          setCardDetails({...cardDetails, cardNumber: val});
                        }}
                      />
                    </div>
                    {errors.cardNumber && <p className={styles.errorText}>{errors.cardNumber}</p>}
                  </div>
                  <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Expiration date *</label>
                      <div className={styles.relative}>
                        <Calendar className={`${styles.inputIcon} ${errors.expiryDate ? styles.inputIconError : ''}`} size={18} />
                        <input 
                          type="text" 
                          required 
                          className={`${styles.inputField} ${errors.expiryDate ? styles.inputFieldError : ''}`} 
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          maxLength={5}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            setCardDetails({...cardDetails, expiryDate: val});
                          }}
                        />
                      </div>
                      {errors.expiryDate && <p className={styles.errorText}>{errors.expiryDate}</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={`${styles.formLabel} ${styles.flexBetween}`}>
                        CVC *
                        <Info size={14} color="#cbd5e1" />
                      </label>
                      <div className={styles.relative}>
                        <Lock className={`${styles.inputIcon} ${errors.cvc ? styles.inputIconError : ''}`} size={18} />
                        <input 
                          type="text" 
                          required 
                          className={`${styles.inputField} ${errors.cvc ? styles.inputFieldError : ''}`} 
                          placeholder="123"
                          value={cardDetails.cvc}
                          maxLength={4}
                          onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                      {errors.cvc && <p className={styles.errorText}>{errors.cvc}</p>}
                    </div>
                  </div>

                  <label className={styles.saveCard}>
                    <input type="checkbox" className={styles.radioInput} />
                    <span>Save card for future purchases</span>
                  </label>
                </form>
              )}

              {paymentMethod === 'google' && (
                <div className={styles.gpayPlaceholder}>
                   <div className={styles.gpayIcon}>
                      <Lock size={24} />
                   </div>
                   <p className={styles.gpayTitle}>Secure Google Checkout</p>
                   <p className={styles.gpayDesc}>You'll be redirected to your Google account to confirm.</p>
                </div>
              )}
            </section>

            {/* Section 3: Consent */}
            <div className={styles.consentBox}>
              <label className={styles.consentLabel}>
                <div className={styles.pt1}>
                  <input type="checkbox" className={styles.radioInput} defaultChecked />
                </div>
                <p className={styles.consentText}>
                  I consent to receiving marketing emails from LuxeStay, including promotions, personalized recommendations, rewards, travel experiences, and updates about LuxeStay's products and services. Read our <span>privacy policy</span>.
                </p>
              </label>
              <p className={styles.termsText}>
                Your booking is directly with {bookingState.hotelName} and by completing this booking you agree to the <span>booking conditions</span>, <span>general terms</span>, <span>privacy policy</span>, and <span>wallet terms</span>.
              </p>
            </div>
          </div>

          {/* Right Column: Summary Sticky */}
          <div className={styles.sidebar}>
            <div className={styles.premiumContainer}>
              <div className={styles.premiumGlow}></div>
              
              <div className={styles.premiumCard}>
                {/* Premium Trust Badge */}
                <div className={styles.premiumBadgeRow}>
                  <div className={styles.premiumBadge}>
                    <ShieldCheck size={10} className={styles.badgeIcon} />
                    LuxeStay Premium Booking
                  </div>
                </div>

                <div className={styles.hotelSummary}>
                  <img src={bookingState.hotelImage} className={styles.hotelImg} alt={bookingState.hotelName} />
                  <div>
                     <h3 className={styles.hotelName}>{bookingState.hotelName}</h3>
                     <div className={styles.hotelStars}>
                        {[...Array(bookingState.stars)].map((_, i) => (
                          <div key={i} className={styles.starDot}></div>
                        ))}
                     </div>
                     <p className={styles.hotelDist}>
                       <MapPin size={10} /> {bookingState.distance}
                     </p>
                  </div>
                </div>

              <div className={styles.bookingGrid}>
                <div className={styles.flexColGap1}>
                  <div className={styles.gridHeader}>
                    <p className={styles.gridLabel}>Your booking details</p>
                    <Sparkles size={14} className={styles.sparkles} />
                  </div>
                  
                  <div className={styles.bookingBox}>
                    <div className={styles.dateRow}>
                      <div className={styles.dateItem}>
                        <Calendar size={16} color="#94a3b8" />
                        <div className={styles.dateInfo}>
                          <label>Check-in</label>
                          <p>{bookingState.checkIn}</p>
                        </div>
                      </div>
                      <div className={`${styles.dateInfo} ${styles.textRight}`}>
                        <label>Check-out</label>
                        <p>{bookingState.checkOut}</p>
                      </div>
                    </div>

                    <div className={styles.totalRow}>
                      <div className={styles.dateItem}>
                        <Users size={16} color="#94a3b8" />
                        <div className={styles.dateInfo}>
                          <label>Guests</label>
                          <p>{bookingState.guests} People</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={styles.summaryTitle}>
                    <Receipt size={20} />
                    Price summary
                  </h4>
                  <div className={styles.priceSummary}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Room Price</span>
                      <span className={styles.priceValue}>R {bookingState.totalPrice - Math.round(bookingState.totalPrice * 0.15)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>VAT (15%)</span>
                      <span className={styles.priceValue}>R {Math.round(bookingState.totalPrice * 0.15)}</span>
                    </div>
                    <div className={styles.finalRow}>
                      <span className={styles.priceLabel}>Total Amount</span>
                      <span className={styles.finalAmount}>R {bookingState.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

                <div className={styles.pt2}>
                  <button 
                    disabled={loading}
                    form="payment-form"
                    type="submit"
                    className={styles.confirmBtn}
                    onClick={paymentMethod === 'card' ? undefined : handleCompleteBooking}
                  >
                    {loading ? (
                      <>
                        <div className={styles.spinner}></div>
                        Processing...
                      </>
                    ) : 'Confirm and Pay'}
                  </button>
                  <div className={styles.safeguard}>
                    <ShieldCheck size={16} className={styles.safeguardIcon} />
                    <span className={styles.safeguardText}>Platinum Protected Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Persistent Summary Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={styles.mobileBar}
      >
        <div className={styles.mobileContent}>
          <div className={styles.mobileHotel}>
            <img src={bookingState.hotelImage} className={styles.mobileImg} alt="" />
            <div className={styles.minW0}>
              <p className={styles.mobileTitle}>{bookingState.hotelName}</p>
              <p className={styles.mobileMeta}>{bookingState.checkIn} • {bookingState.guests} Guests</p>
            </div>
          </div>
          <div className={styles.mobilePrice}>
            <p className={styles.mobilePriceLabel}>Total Price</p>
            <p className={styles.mobilePriceValue}>R {bookingState.totalPrice}</p>
          </div>
        </div>
      </motion.div>

      {/* Professional Payment Overlay */}
      <AnimatePresence>
        {(paymentStep === 'processing' || paymentStep === 'success') && (
          <div className={styles.overlay}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.backdrop}
            />
            
            <AnimatePresence mode="wait">
              {paymentStep === 'processing' ? (
                <motion.div 
                  key="processing"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={styles.modalProcessing}
                >
                  <div className={styles.loaderWrapper}>
                    <div className={styles.track}></div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className={styles.ring}
                    ></motion.div>
                    <Lock className={styles.loaderIcon} size={32} />
                  </div>
                  <h3 className={styles.processingHeader}>Processing Payment</h3>
                  <p className={styles.processingStatus}>{processingStatus}</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ scale: 0.8, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className={styles.modalSuccess}
                >
                  {/* Header with Background */}
                  <div className={styles.successHeader}>
                    <div className={styles.pattern}></div>
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                      className={styles.checkWrapper}
                    >
                      <Check size={40} strokeWidth={4} />
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={styles.successTitle}
                    >
                      Booking Confirmed!
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className={styles.refCode}
                    >
                      Ref # {orderRef}
                    </motion.p>
                  </div>

                  {/* Modal Body */}
                  <div className={styles.successBody}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className={styles.successBodyContainer}
                    >
                      {/* Brand Trust Badge */}
                      <div className={styles.verificationBadge}>
                        <div className={styles.verifyDot}></div>
                        <span className={styles.verifyText}>LuxeStay Verified Booking</span>
                      </div>

                      <div className={styles.hotelPlate}>
                        <img src={bookingState.hotelImage} className={styles.plateImg} alt={bookingState.hotelName} />
                        <div>
                          <p className={styles.plateName}>{bookingState.hotelName}</p>
                          <p className={styles.plateMeta}>
                            <MapPin size={10} /> {bookingState.distance}
                          </p>
                        </div>
                      </div>

                      <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                          <p className={styles.statLabel}>
                            <Calendar size={10} /> Duration
                          </p>
                          <p className={styles.statValue}>{bookingState.checkIn} — {bookingState.checkOut}</p>
                        </div>
                        <div className={styles.statBox}>
                          <p className={styles.statLabel}>
                            <Users size={10} /> Occupancy
                          </p>
                          <p className={`${styles.statValue} ${styles.statValueLarge}`}>{bookingState.guests} Guests</p>
                        </div>
                      </div>

                      <div className={styles.billBox}>
                        <div>
                          <p className={styles.billStatus}>Transaction Success</p>
                          <p className={styles.billTitle}>Payment Secured</p>
                        </div>
                        <div className={styles.billTotal}>
                          <p className={styles.amountTitle}>Total Paid</p>
                          <p className={styles.amount}>R {bookingState.totalPrice}</p>
                        </div>
                      </div>

                      {/* Professional Reassurance Section */}
                      <div className={styles.reassuranceList}>
                        <div className={styles.reassuranceItem}>
                          <div className={styles.reassuranceIcon}>
                            <Mail size={18} />
                          </div>
                          <div className={styles.reassuranceInfo}>
                            <p>Email Sent</p>
                            <p>Check your inbox for your digital key and check-in roadmap.</p>
                          </div>
                        </div>
                        <div className={`${styles.reassuranceItem}`}>
                          <div className={`${styles.reassuranceIcon} ${styles.warningIcon}`}>
                            <ShieldCheck size={18} />
                          </div>
                          <div className={styles.reassuranceInfo}>
                            <p>Full Coverage</p>
                            <p>Your stay is protected by our Platinum Guarantee. We're here 24/7.</p>
                          </div>
                        </div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={styles.summaryPara}
                      >
                        Your luxury escape at <span>{bookingState.hotelName}</span> is officially secured. We have sent a comprehensive check-in dossier and your digital key to your registered email address. Our concierge team is standing by to ensure your experience is nothing short of perfection.
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <button 
                        onClick={() => navigate('/confirmation')}
                        className={styles.viewBtn}
                      >
                        View My Itinerary <ArrowRight size={20} />
                      </button>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      <p className={styles.redirectNote}>
                        Redirecting to your details in {redirectCountdown}s...
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

