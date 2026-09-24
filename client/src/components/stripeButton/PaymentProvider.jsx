import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { stripePublishableKey } from "@/config/clientConfig";

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

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

export const PaymentProvider = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export const CardInput = (props) => (
  <CardElement options={CARD_OPTIONS} {...props} />
);

// Feature code receives an application-level card interface, not Stripe elements.
export const useCardPayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const getCard = () => elements?.getElement(CardElement);
  const createToken = async () => {
    const card = getCard();
    if (!stripe || !card)
      throw new Error(
        "Card details are unavailable. Refresh the page and try again.",
      );
    const { token, error } = await stripe.createToken(card);
    if (error || !token)
      throw new Error(
        error?.message || "Please check your card details and try again.",
      );
    return token;
  };
  return {
    ready: Boolean(stripe && elements),
    createToken,
    clear: () => getCard()?.clear(),
  };
};
