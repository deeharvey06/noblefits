# Noble Fits — Phase 10 Checkout

Phase 10 optimizes the existing checkout for payment completion without changing commerce or backend behavior.

## Existing architecture preserved

The current application has one commerce route for bag review and payment: `/checkout`. It does not have APIs or persisted models for customer contact details, shipping addresses, billing addresses, taxes, fulfillment, or order records. Phase 10 therefore does not introduce UI fields that would collect unusable customer data.

The existing payment contract remains:

- Stripe Elements collects card details in the browser.
- Stripe.js creates a token from the Card Element.
- The client sends `{ amount, token }` to `POST /payment`.
- The existing Express/Stripe server behavior is unchanged.

## Checkout hierarchy

The page now presents two supported steps:

1. **Bag** — review products, quantities, line totals, and edit the selection.
2. **Payment** — confirm the amount due and submit card payment.

On large screens, the order summary remains visible in a restrained sticky panel. On smaller screens, content is deliberately ordered as bag review → order summary → payment so the customer sees the amount due immediately before entering payment details.

## Payment validation

The Stripe Card Element now reports completion and validation errors to the surrounding checkout UI. The Pay action remains disabled until card details are complete. Stripe validation errors are surfaced inline and announced accessibly.

After a successful payment response, the payment action is disabled to reduce accidental duplicate submissions. Phase 10 does not clear the cart, create an order record, invent an order number, or add confirmation/fulfillment behavior because those would change order logic beyond this phase.

## Trust cues

The checkout only uses trust statements supported by the implementation: card details are collected by Stripe Elements and tokenized before the payment request is sent to the application. Test-card instructions appear only when the configured publishable key begins with `pk_test_`.

## Intentionally not added

The following are not present in the current commerce architecture and were not fabricated:

- contact information form
- shipping-address form
- separate billing-address form
- shipping methods or delivery estimates
- tax calculation
- coupons or promo codes
- order creation / order number
- fulfillment or tracking
- guarantees, return promises, or shipping claims

These capabilities should only be added alongside the backend/order infrastructure required to store and use the data correctly.
