import { formatMoney } from "@/utils/formatMoney";

const CheckoutSummary = ({ total }) => (
  <aside
    className="cart-summary checkout-summary"
    aria-labelledby="cart-summary-title"
  >
    <div className="cart-summary__panel">
      <div className="cart-summary__heading">
        <p className="cart-summary__eyebrow">Order summary</p>
        <h2 id="cart-summary-title">Amount due</h2>
      </div>

      <dl className="cart-summary__totals" aria-live="polite">
        <div>
          <dt>Merchandise subtotal</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
        <div className="cart-summary__total-row">
          <dt>Payment amount</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
      </dl>

      <p className="cart-summary__scope-note">
        This storefront does not currently calculate shipping, taxes, discounts,
        or promo codes.
      </p>

      <div className="checkout-summary__trust" role="note">
        <span className="checkout-summary__trust-mark" aria-hidden="true">
          S
        </span>
        <p>
          Card details are collected by Stripe Elements and exchanged for a
          token before the payment request is sent.
        </p>
      </div>

      <a href="#bag-review" className="cart-summary__continue">
        Edit bag
      </a>
    </div>
  </aside>
);

export default CheckoutSummary;
