import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  Upload,
  CheckCircle,
  ArrowLeft,
  Shield,
  Lock,
} from "lucide-react";
import PayPalButton from "./PayPalButton";
import styles from "./CheckoutPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";

interface CheckoutPageProps {
  bookingData: {
    id: string; 
    room_id: number;
    room_name: string;
    full_name: string;
    phone: string;
    email: string;
    check_in: string;
    check_out: string;
    total_price: string | number;
    nights: number;
  };
  onBack: () => void;
  onPaymentComplete: () => void;
}

const CheckoutPage = ({
  bookingData,
  onBack,
  onPaymentComplete,
}: CheckoutPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "eft" | null>(
    null
  );
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const totalPrice = Number(bookingData.total_price) || 0;

  const bankDetails = {
    bankName: "First National Bank",
    accountName: "LuxeStay Hotel Ltd",
    accountNumber: "62847593012",
    branchCode: "250655",
    accountType: "Business Current",
    reference: `BOOKING-${bookingData.room_id}-${Date.now()}`,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload only JPG, PNG, or PDF files");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setProofOfPayment(file);
  };

  const handleEFTSubmit = async () => {
    if (!proofOfPayment) {
      alert("Please upload proof of payment");
      return;
    }

    setUploading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploadSuccess(true);
      setTimeout(() => onPaymentComplete(), 2000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload proof of payment. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const amountInUSD = (totalPrice / 18).toFixed(2);


const location = useLocation();
const navigate = useNavigate();

bookingData = bookingData || location.state;
onBack = onBack || (() => navigate(-1));
onPaymentComplete = onPaymentComplete || (() => navigate("/profile"));


if (!bookingData) {
  return <div className={styles.pageContainer}>No booking data received.</div>;
}

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundOverlay} />

      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <button onClick={onBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Booking</span>
          </button>

          <div className={styles.securityBadge}>
            <Shield size={16} />
            <span>Secure Checkout</span>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Booking Summary</h2>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Room</span>
                <span className={styles.summaryValue}>{bookingData.room_name}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Guest</span>
                <span className={styles.summaryValue}>{bookingData.full_name}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Check-in</span>
                <span className={styles.summaryValue}>
                  {new Date(bookingData.check_in).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Check-out</span>
                <span className={styles.summaryValue}>
                  {new Date(bookingData.check_out).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Duration</span>
                <span className={styles.summaryValue}>
                  {bookingData.nights} night{bookingData.nights > 1 ? "s" : ""}
                </span>
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Amount</span>
                <span className={styles.totalValue}>
                  R{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.paymentCard}>
            <h2 className={styles.paymentTitle}>Choose Payment Method</h2>

            <div className={styles.paymentMethods}>
              <button
                className={`${styles.paymentMethodButton} ${
                  paymentMethod === "paypal" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className={styles.methodIcon}>
                  <CreditCard size={24} />
                </div>
                <div className={styles.methodInfo}>
                  <h3>PayPal</h3>
                  <p>Pay securely with PayPal or credit card</p>
                </div>
              </button>

              <button
                className={`${styles.paymentMethodButton} ${
                  paymentMethod === "eft" ? styles.active : ""
                }`}
                onClick={() => setPaymentMethod("eft")}
              >
                <div className={styles.methodIcon}>
                  <Building2 size={24} />
                </div>
                <div className={styles.methodInfo}>
                  <h3>EFT / Bank Transfer</h3>
                  <p>Direct bank transfer with proof of payment</p>
                </div>
              </button>
            </div>

            {paymentMethod === "paypal" && (
              <div className={styles.paymentContent}>
                <div className={styles.paymentHeader}>
                  <Lock size={16} />
                  <span>Encrypted Payment Processing</span>
                </div>
                <p className={styles.conversionNote}>
                  Amount: ${amountInUSD} USD (approx. R{totalPrice})
                </p>
                <div className={styles.paypalContainer}>
                  <PayPalButton
                    amount={amountInUSD}
                    onSuccess={onPaymentComplete}
                    bookingData={{
                      id: bookingData.id, 
                      room_id: bookingData.room_id,
                      room_name: bookingData.room_name,
                      full_name: bookingData.full_name,
                      email: bookingData.email,
                      total_price: totalPrice,
                    }}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "eft" && (
              <div className={styles.paymentContent}>
                <div className={styles.bankDetailsSection}>
                  <h3 className={styles.bankDetailsTitle}>Bank Transfer Details</h3>

                  <div className={styles.bankDetailsGrid}>
                    <div className={styles.bankDetail}>
                      <span className={styles.bankDetailLabel}>Bank Name</span>
                      <span className={styles.bankDetailValue}>
                        {bankDetails.bankName}
                      </span>
                    </div>

                    <div className={styles.bankDetail}>
                      <span className={styles.bankDetailLabel}>Account Name</span>
                      <span className={styles.bankDetailValue}>
                        {bankDetails.accountName}
                      </span>
                    </div>

                    <div className={styles.bankDetail}>
                      <span className={styles.bankDetailLabel}>Account Number</span>
                      <span className={styles.bankDetailValue}>
                        {bankDetails.accountNumber}
                      </span>
                    </div>

                    <div className={styles.bankDetail}>
                      <span className={styles.bankDetailLabel}>Branch Code</span>
                      <span className={styles.bankDetailValue}>
                        {bankDetails.branchCode}
                      </span>
                    </div>

                    <div className={styles.bankDetail}>
                      <span className={styles.bankDetailLabel}>Account Type</span>
                      <span className={styles.bankDetailValue}>
                        {bankDetails.accountType}
                      </span>
                    </div>

                    <div className={styles.bankDetail}>
                      <span className={styles.bankDetailLabel}>Payment Reference</span>
                      <span className={`${styles.bankDetailValue} ${styles.reference}`}>
                        {bankDetails.reference}
                      </span>
                    </div>
                  </div>

                  <div className={styles.importantNote}>
                    <strong>Important:</strong> Please use the payment reference above when making your transfer
                  </div>
                </div>

                <div className={styles.uploadSection}>
                  <h3 className={styles.uploadTitle}>Upload Proof of Payment</h3>
                  <p className={styles.uploadDescription}>
                    Please upload a screenshot or PDF of your payment confirmation
                  </p>

                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                    />
                    <div className={styles.uploadContent}>
                      <Upload size={32} />
                      <p className={styles.uploadText}>
                        {proofOfPayment
                          ? proofOfPayment.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className={styles.uploadSubtext}>JPG, PNG or PDF (max 5MB)</p>
                    </div>
                  </label>

                  {proofOfPayment && !uploadSuccess && (
                    <button
                      onClick={handleEFTSubmit}
                      disabled={uploading}
                      className={styles.submitButton}
                    >
                      {uploading ? "Uploading..." : "Submit Payment Proof"}
                    </button>
                  )}

                  {uploadSuccess && (
                    <div className={styles.successMessage}>
                      <CheckCircle size={24} />
                      <span>Payment proof uploaded successfully! Redirecting...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <p>
            Your payment information is secure and encrypted. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
