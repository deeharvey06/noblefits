import CheckoutReceipt from "@/pages/checkout/CheckoutReceipt";
import CheckoutSummary from "@/pages/checkout/CheckoutSummary";
import { useCheckout } from "@/pages/checkout/useCheckout";
import { ROUTES } from "@/config/routes";
import { AppLink as Link } from "@/components/navigation/AppLink";

import StripeCheckoutButton from "@/components/stripeButton/StripeButton";
import CheckoutItem from "@/components/checkoutItem/CheckoutItem";
import { EmptyState } from "@/design-system";

import "./checkout.scss";

const CheckoutPage = () => {
  const { cartItems, itemCount, total, paymentReceipt, handlePaymentSuccess } =
    useCheckout();

  if (paymentReceipt) {
    return <CheckoutReceipt paymentReceipt={paymentReceipt} />;
  }

  if (!cartItems.length) {
    return (
      <section className="cart-page cart-page--empty">
        <EmptyState
          eyebrow="Your bag"
          title="Your bag is empty"
          description="Explore the catalog and add something you want to keep close."
        >
          <Link
            to={ROUTES.shop}
            className="ds-button ds-button--primary ds-button--md cart-page__empty-action"
          >
            <span className="ds-button__label">Explore the shop</span>
          </Link>
        </EmptyState>
      </section>
    );
  }

  return (
    <div className="cart-page checkout-page">
      <header className="checkout-page__header">
        <div>
          <p className="cart-page__eyebrow">Checkout</p>
          <h1>Complete your purchase.</h1>
          <p className="checkout-page__intro">
            Review your bag, confirm the amount due, then complete card payment.
          </p>
        </div>
        <p className="cart-page__count" aria-live="polite">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </p>
      </header>

      <ol className="checkout-progress" aria-label="Checkout progress">
        <li className="checkout-progress__step checkout-progress__step--complete">
          <span className="checkout-progress__number" aria-hidden="true">
            ✓
          </span>
          <span>
            <strong>Bag</strong>
            <small>Reviewed</small>
          </span>
        </li>
        <li
          className="checkout-progress__step checkout-progress__step--current"
          aria-current="step"
        >
          <span className="checkout-progress__number" aria-hidden="true">
            2
          </span>
          <span>
            <strong>Payment</strong>
            <small>Current step</small>
          </span>
        </li>
      </ol>

      <div className="checkout-page__layout">
        <section
          id="bag-review"
          className="checkout-section checkout-section--review"
          aria-labelledby="bag-items-title"
        >
          <div className="cart-page__section-heading">
            <div>
              <p className="checkout-section__step-label">Step 1</p>
              <h2 id="bag-items-title">What you’re buying</h2>
            </div>
            <Link to={ROUTES.shop} className="cart-page__continue-link">
              Continue shopping
            </Link>
          </div>

          <div className="cart-page__item-list">
            {cartItems.map((cartItem) => (
              <CheckoutItem key={cartItem.id} cartItem={cartItem} />
            ))}
          </div>

          <a
            href="#payment"
            className="ds-button ds-button--secondary ds-button--md checkout-section__continue"
          >
            <span className="ds-button__label">Continue to payment</span>
          </a>
        </section>

        <CheckoutSummary total={total} />

        <section
          id="payment"
          className="checkout-section checkout-section--payment"
          aria-labelledby="payment-title"
        >
          <div className="checkout-section__heading">
            <p className="checkout-section__step-label">Step 2</p>
            <h2 id="payment-title">Secure card payment</h2>
            <p>
              Enter your card details and review the amount on the button before
              submitting payment.
            </p>
          </div>

          <div
            className="checkout-scope"
            role="note"
            aria-label="Checkout scope"
          >
            <strong>Payment-only checkout</strong>
            <p>
              The current application does not collect contact information,
              shipping addresses, or a separate billing address. Those
              capabilities require commerce and order infrastructure that is not
              part of the existing checkout.
            </p>
          </div>

          <StripeCheckoutButton
            price={total}
            onSuccess={handlePaymentSuccess}
          />
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;
