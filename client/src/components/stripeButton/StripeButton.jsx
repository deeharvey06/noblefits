import { PaymentProvider } from "@/components/stripeButton/PaymentProvider";
import { stripePublishableKey } from "@/config/clientConfig";
import PaymentForm from "@/components/stripeButton/PaymentForm";
import "./stripeButton.scss";

const StripeCheckoutButton = ({ price, onSuccess }) => {
  if (!stripePublishableKey) {
    return (
      <div className="payment-status" role="note">
        <strong>Demo checkout</strong>
        <span>
          Card payments aren’t enabled for this demo. You can still explore the
          catalog and manage your bag.
        </span>
      </div>
    );
  }

  if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    return null;
  }

  return (
    <PaymentProvider>
      <PaymentForm price={price} onSuccess={onSuccess} />
    </PaymentProvider>
  );
};

export default StripeCheckoutButton;
