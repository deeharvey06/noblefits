import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import StripeCheckoutButton from "../../components/stripeButton/StripeButton";
import CheckoutItem from "../../components/checkoutItem/CheckoutItem";
import { EmptyState } from "../../design-system";
import { clearCart } from "../../redux/cart/actions";

import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from "../../redux/cart/cartSelectors";

import "./checkout.scss";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemsCount);
  const total = useSelector(selectCartTotal);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const handlePaymentSuccess = () => {
    setPaymentReceipt({ amount: total, itemCount });
    dispatch(clearCart());
  };

  if (paymentReceipt) {
    return (
      <section className="checkout-complete ds-container" aria-labelledby="checkout-complete-title">
        <p className="checkout-complete__eyebrow">Payment complete</p>
        <h1 id="checkout-complete-title">Thanks. Your payment was received.</h1>
        <p className="checkout-complete__summary">
          {formatMoney(paymentReceipt.amount)} was submitted for {paymentReceipt.itemCount} item{paymentReceipt.itemCount === 1 ? "" : "s"}.
        </p>
        <p className="checkout-complete__note">
          Your bag has been cleared to prevent an accidental repeat purchase. This storefront does not currently persist order history or fulfillment records.
        </p>
        <div className="checkout-complete__actions">
          <Link to="/shop" className="ds-button ds-button--primary ds-button--md">
            <span className="ds-button__label">Continue shopping</span>
          </Link>
          <Link to="/account" className="ds-button ds-button--secondary ds-button--md">
            <span className="ds-button__label">View account</span>
          </Link>
        </div>
      </section>
    );
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
            to="/shop"
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
          <span className="checkout-progress__number" aria-hidden="true">✓</span>
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
            <Link to="/shop" className="cart-page__continue-link">
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

        <aside className="cart-summary checkout-summary" aria-labelledby="cart-summary-title">
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
              This storefront does not currently calculate shipping, taxes, discounts, or promo codes.
            </p>

            <div className="checkout-summary__trust" role="note">
              <span className="checkout-summary__trust-mark" aria-hidden="true">S</span>
              <p>
                Card details are collected by Stripe Elements and exchanged for a token before the
                payment request is sent.
              </p>
            </div>

            <a href="#bag-review" className="cart-summary__continue">
              Edit bag
            </a>
          </div>
        </aside>

        <section
          id="payment"
          className="checkout-section checkout-section--payment"
          aria-labelledby="payment-title"
        >
          <div className="checkout-section__heading">
            <p className="checkout-section__step-label">Step 2</p>
            <h2 id="payment-title">Secure card payment</h2>
            <p>
              Enter your card details and review the amount on the button before submitting payment.
            </p>
          </div>

          <div className="checkout-scope" role="note" aria-label="Checkout scope">
            <strong>Payment-only checkout</strong>
            <p>
              The current application does not collect contact information, shipping addresses, or a
              separate billing address. Those capabilities require commerce and order infrastructure
              that is not part of the existing checkout.
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
