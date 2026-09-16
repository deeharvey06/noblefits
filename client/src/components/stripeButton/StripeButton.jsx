import { useMemo, useState } from "react";
import axios from "axios";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "../../design-system";
import { isStripeTestMode, stripePublishableKey } from "../../config/clientConfig";

import "./stripeButton.scss";

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const CARD_OPTIONS = {
  hidePostalCode: false,
  style: {
    base: {
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "16px",
      lineHeight: "24px",
      color: "#171714",
      "::placeholder": { color: "#77726a" },
    },
    invalid: { color: "#a63831" },
  },
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const PaymentForm = ({ price, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardState, setCardState] = useState({ complete: false, error: "" });
  const [paymentState, setPaymentState] = useState({ status: "idle", message: "" });
  const priceForStripe = useMemo(() => Math.round(Number(price) * 100), [price]);
  const formattedPrice = useMemo(() => formatMoney(price), [price]);

  if (!Number.isFinite(priceForStripe) || priceForStripe <= 0) {
    return null;
  }

  const handleCardChange = (event) => {
    setCardState({
      complete: Boolean(event.complete),
      error: event.error?.message || "",
    });

    if (paymentState.status === "error") {
      setPaymentState({ status: "idle", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || paymentState.status === "loading" || paymentState.status === "success") {
      return;
    }

    if (!cardState.complete) {
      setPaymentState({
        status: "error",
        message: cardState.error || "Complete your card details before paying.",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentState({
        status: "error",
        message: "Card details are unavailable. Refresh the page and try again.",
      });
      return;
    }

    setPaymentState({ status: "loading", message: "Processing payment…" });

    const { token, error: tokenError } = await stripe.createToken(cardElement);

    if (tokenError || !token) {
      setPaymentState({
        status: "error",
        message: tokenError?.message || "Please check your card details and try again.",
      });
      return;
    }

    try {
      await axios.post("/payment", {
        amount: priceForStripe,
        token,
      });
      cardElement.clear();
      setCardState({ complete: false, error: "" });
      setPaymentState({ status: "success", message: "Payment completed successfully." });
      onSuccess?.();
    } catch (error) {
      console.error("Payment request failed", error);
      setPaymentState({
        status: "error",
        message: "There was an issue with your payment. Check your details and try again.",
      });
    }
  };

  const isLoading = paymentState.status === "loading";
  const isComplete = paymentState.status === "success";
  const paymentDisabled = !stripe || !cardState.complete || isLoading || isComplete;
  const visibleError = cardState.error || (paymentState.status === "error" ? paymentState.message : "");

  return (
    <form className="stripe-payment" onSubmit={handleSubmit} noValidate>
      <div className="stripe-payment__field">
        <div className="stripe-payment__label-row">
          <label className="stripe-payment__label" htmlFor="card-element">
            Card details
          </label>
          <span>Required</span>
        </div>
        <div
          className={`stripe-payment__element ${visibleError ? "stripe-payment__element--error" : ""}`}
        >
          <CardElement
            id="card-element"
            options={CARD_OPTIONS}
            onChange={handleCardChange}
          />
        </div>
        <p className="stripe-payment__hint">Card number · expiry · CVC · postal code</p>
      </div>

      {visibleError && (
        <p className="payment-status payment-status--error" role="alert">
          {visibleError}
        </p>
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={paymentDisabled}
        loading={isLoading}
      >
        {isComplete ? "Payment complete" : `Pay ${formattedPrice}`}
      </Button>

      {paymentState.message && paymentState.status !== "error" && (
        <div
          className={`payment-status payment-status--${paymentState.status}`}
          role="status"
          aria-live="polite"
        >
          <strong>{isComplete ? "Payment complete" : "Payment status"}</strong>
          <span>{paymentState.message}</span>
        </div>
      )}

      <p className="stripe-payment__security-note">
        Card details are collected by Stripe Elements. The payment request sends a Stripe token,
        not the raw card number.
      </p>

      {isStripeTestMode && (
        <div className="stripe-payment__test-card" role="note" aria-label="Test payment details">
          <strong>Stripe test mode</strong>
          <span>Use 4242 4242 4242 4242</span>
          <span>Any future expiry · any 3-digit CVC</span>
        </div>
      )}
    </form>
  );
};

const StripeCheckoutButton = ({ price, onSuccess }) => {
  if (!stripePublishableKey) {
    return (
      <div className="payment-status payment-status--error" role="alert">
        <strong>Payment is unavailable</strong>
        <span>Add VITE_STRIPE_PUBLISHABLE_KEY to the client environment.</span>
      </div>
    );
  }

  if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm price={price} onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeCheckoutButton;
