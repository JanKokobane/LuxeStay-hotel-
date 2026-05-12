import React, { useEffect } from "react";

interface PayPalButtonProps {
  amount: string;
  onSuccess: () => void;
  bookingData: {
    id: string;
    room_id: number;
    room_name: string;
    full_name: string;
    email: string;
    total_price: number;
  };
}

declare global {
  interface Window {
    paypal?: any;
  }
}

function PayPalButton({
  amount,
  onSuccess,
  bookingData,
}: PayPalButtonProps) {
  useEffect(() => {
    const container = document.getElementById(
      "paypal-button-container"
    );

    // ✅ Prevent duplicate PayPal buttons
    if (container) {
      container.innerHTML = "";
    }

    const renderPayPalButton = () => {
      if (!window.paypal) {
        console.error("PayPal SDK not loaded");
        return;
      }

      window.paypal
        .Buttons({
          // ==========================
          // CREATE ORDER
          // ==========================
          createOrder: async () => {
            try {
              const response = await fetch(
                "https://tango-hotel-backend.onrender.com/api/payments/create-order",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    amount,
                  }),
                }
              );

              const data = await response.json();

              if (!data.success) {
                throw new Error(
                  data.message || "Failed to create order"
                );
              }

              console.log(
                "✅ PayPal order created:",
                data.orderID
              );

              return data.orderID;
            } catch (error) {
              console.error(
                "❌ PayPal create order error:",
                error
              );

              throw error;
            }
          },

          // ==========================
          // APPROVE PAYMENT
          // ==========================
          onApprove: async (data: any) => {
            try {
              console.log(
                "💳 PayPal approved order:",
                data.orderID
              );

              const response = await fetch(
                "https://tango-hotel-backend.onrender.com/api/payments/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    bookingData,
                  }),
                }
              );

              const result = await response.json();

              console.log(
                "✅ Backend verification result:",
                result
              );

              if (!result.success) {
                throw new Error(
                  result.message ||
                    "Payment verification failed"
                );
              }

              alert("Payment successful!");

              onSuccess();
            } catch (error) {
              console.error(
                "❌ Payment verification error:",
                error
              );

              alert(
                "Payment completed but verification failed."
              );
            }
          },

          // ==========================
          // PAYPAL ERROR
          // ==========================
          onError: (err: any) => {
            console.error("❌ PayPal SDK Error:", err);

            alert(
              "PayPal payment failed. Please try again."
            );
          },
        })
        .render("#paypal-button-container");
    };

    // ==========================
    // LOAD PAYPAL SDK
    // ==========================
    if (window.paypal) {
      renderPayPalButton();
    } else {
      const existingScript = document.querySelector(
        'script[src*="paypal.com/sdk/js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = `https://www.paypal.com/sdk/js?client-id=${
          import.meta.env.VITE_PAYPAL_CLIENT_ID
        }&currency=USD`;

        script.async = true;

        script.onload = () => {
          console.log("✅ PayPal SDK loaded");
          renderPayPalButton();
        };

        script.onerror = () => {
          console.error("❌ Failed to load PayPal SDK");

          alert("Failed to load PayPal.");
        };

        document.body.appendChild(script);

        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } else {
        renderPayPalButton();
      }
    }
  }, [amount, bookingData, onSuccess]);

  return <div id="paypal-button-container"></div>;
}

export default PayPalButton;