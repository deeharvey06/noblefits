import { Button } from "@/design-system";
import { CardInput } from "@/components/stripeButton/PaymentProvider";
import { isStripeTestMode } from "@/config/clientConfig";
import { usePayment } from "@/components/stripeButton/usePayment";

const PaymentForm = ({ price, onSuccess }) => {
  const {
    validAmount,
    formattedPrice,
    handleSubmit,
    handleCardChange,
    paymentDisabled,
    visibleError,
    isLoading,
    isComplete,
    paymentState,
  } = usePayment({ price, onSuccess });
  if (!validAmount) return null;

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
          <CardInput id="card-element" onChange={handleCardChange} />
        </div>
        <p className="stripe-payment__hint">
          Card number · expiry · CVC · postal code
        </p>
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
        Card details are collected by Stripe Elements. The payment request sends
        a Stripe token, not the raw card number.
      </p>

      {isStripeTestMode && (
        <div
          className="stripe-payment__test-card"
          role="note"
          aria-label="Test payment details"
        >
          <strong>Stripe test mode</strong>
          <span>Use 4242 4242 4242 4242</span>
          <span>Any future expiry · any 3-digit CVC</span>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;
