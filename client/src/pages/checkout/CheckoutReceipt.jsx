import { formatMoney } from "@/utils/formatMoney";
import { ROUTES } from "@/config/routes";
import { AppLink as Link } from "@/components/navigation/AppLink";

const CheckoutReceipt = ({ paymentReceipt }) => (
  <section
    className="checkout-complete ds-container"
    aria-labelledby="checkout-complete-title"
  >
    <p className="checkout-complete__eyebrow">Payment complete</p>
    <h1 id="checkout-complete-title">Thanks. Your payment was received.</h1>
    <p className="checkout-complete__summary">
      {formatMoney(paymentReceipt.amount)} was submitted for{" "}
      {paymentReceipt.itemCount} item
      {paymentReceipt.itemCount === 1 ? "" : "s"}.
    </p>
    <p className="checkout-complete__note">
      Your bag has been cleared to prevent an accidental repeat purchase. This
      storefront does not currently persist order history or fulfillment
      records.
    </p>
    <div className="checkout-complete__actions">
      <Link
        to={ROUTES.shop}
        className="ds-button ds-button--primary ds-button--md"
      >
        <span className="ds-button__label">Continue shopping</span>
      </Link>
      <Link
        to={ROUTES.account}
        className="ds-button ds-button--secondary ds-button--md"
      >
        <span className="ds-button__label">View account</span>
      </Link>
    </div>
  </section>
);

export default CheckoutReceipt;
