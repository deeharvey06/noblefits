# Noble Fits — Phase 9 Cart

## Purpose

Phase 9 redesigns the existing cart experience around three immediate customer questions:

1. What am I buying?
2. How much does it cost?
3. What do I do next?

The existing application combines bag review and card payment on `/checkout`. Phase 9 preserves that route and payment contract rather than inventing a new checkout architecture. The cart review and payment areas are now visually separated so Phase 10 can further optimize checkout without undoing the cart work.

## What the current data supports

Every persisted cart line currently provides product ID, name, image URL, unit price, and quantity. Phase 9 therefore presents those fields prominently and calculates only deterministic UI values already implied by the existing cart reducer: line total, item count, merchandise subtotal, and payment amount.

The line-item component can display `variant`, `size`, or `color` if those fields legitimately exist on a future cart item. The current catalog does not provide them, so the UI does not invent them.

## Unsupported commerce information

The current storefront does not provide shipping calculation, tax calculation, discount data, coupon/promo support, or policy-backed shipping/returns messaging. The cart therefore does not display fake free-shipping claims, discount rows, promo inputs, delivery estimates, or return guarantees.

The order summary explicitly identifies the current total as the merchandise subtotal/payment amount and discloses that shipping, taxes, discounts, and promo codes are not currently calculated.

## Cart UX

- Product image, name, unit price, quantity, and line total remain visible.
- Quantity uses the shared accessible `QuantityControl`.
- At quantity one, decrement is disabled; removing the item is an explicit separate action.
- The full cart includes a clear Continue Shopping path.
- The mini-cart now shows item count, line totals, subtotal, review/pay CTA, and Continue Shopping.
- Empty cart state directs customers back to the catalog.
- Desktop uses a two-column cart + sticky summary layout.
- Tablet/mobile stack the summary below the bag and preserve touch-sized controls.

## Payment boundary

Stripe card payment remains the existing next step and continues to post the same amount/token shape to `/payment`. No Stripe server contract or payment calculation was modified in Phase 9.
