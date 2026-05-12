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
    paypal?: {
      Buttons: (config: {
        createOrder: (
          data: unknown,
          actions: {
            order: {
              create: (details: {
                purchase_units: { amount: { value: string } }[];
              }) => Promise<string>;
            };
          }
        ) => Promise<string>;
        onApprove: (
          data: { orderID: string },
          actions: { order: { capture: () => Promise<any> } }
        ) => Promise<void>;
        onError?: (err: Error) => void;
      }) => { render: (selector: string) => Promise<void> };
    };
  }
}

function PayPalButton({ amount, onSuccess, bookingData }: PayPalButtonProps) {
  useEffect(() => {
    let initialized = false;

    const renderPayPalButton = () => {
      if (!window.paypal || initialized) return;
      initialized = true;

      window.paypal.Buttons({
        createOrder: (data, actions) =>
          actions.order.create({
            purchase_units: [{ amount: { value: amount } }],
          }),
        onApprove: async (data, actions) => {
          const order = await actions.order.capture(); // capture finalizes payment
          console.log("💳 Payment captured:", order);

          try {
            const res = await fetch(
              "https://tango-hotel-backend.onrender.com/api/payments/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: order.id, bookingData }), // use order.id
              }
            );

            if (!res.ok) throw new Error("Backend verification failed");
            const result = await res.json();
            console.log("✅ Backend verified:", result);

            onSuccess();
          } catch (error) {
            console.error("Failed to confirm booking:", error);
            alert(
              "Payment captured but booking confirmation failed. Please contact support."
            );
          }
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          alert("Payment failed. Please try again.");
        },
      }).render("#paypal-button-container");
    };

    if (window.paypal) {
      renderPayPalButton();
    } else {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${
        import.meta.env.VITE_PAYPAL_CLIENT_ID
      }&currency=USD`;
      script.async = true;
      script.onload = renderPayPalButton;
      script.onerror = () => {
        console.error("Failed to load PayPal SDK");
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, []);

  return <div id="paypal-button-container"></div>;
}

export default PayPalButton;
