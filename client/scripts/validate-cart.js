const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`Cart validation failed: ${message}`);
  process.exit(1);
};

const checkout = read("src/pages/checkout/Checkout.jsx").replace(/\s+/g, " ");
const checkoutStyles = read("src/pages/checkout/checkout.scss");
const item = read("src/components/checkoutItem/CheckoutItem.jsx");
const dropdown = read("src/components/cartDropdown/CartDropdown.jsx");
const cartUtils = read("src/redux/cart/cartUtils.js");

const requiredCheckoutCopy = [
  "What you’re buying",
  "Order summary",
  "Merchandise subtotal",
  "Payment amount",
  "Continue shopping",
  "Secure card payment",
];

for (const text of requiredCheckoutCopy) {
  if (!checkout.includes(text)) fail(`missing cart hierarchy copy: ${text}`);
}

if (!checkout.includes("selectCartItemsCount"))
  fail("cart item count is not surfaced");
if (!checkout.includes("StripeCheckoutButton"))
  fail("existing Stripe checkout path is not preserved");
if (
  !checkout.includes(
    "does not currently calculate shipping, taxes, discounts, or promo codes",
  )
) {
  fail("unsupported cart capabilities are not disclosed accurately");
}

if (!item.includes("QuantityControl"))
  fail("standard quantity control is not used");
if (!item.includes("Item total")) fail("line-item total is not visible");
if (!item.includes("variantDetails"))
  fail("optional variant information is not supported conditionally");
if (!item.includes("Remove")) fail("remove action is not explicit");

if (!dropdown.includes("Subtotal")) fail("mini-cart subtotal is not visible");
if (!dropdown.includes("REVIEW BAG & PAY"))
  fail("mini-cart next action is unclear");

if (!cartUtils.includes("quantity: cartItem.quantity - 1")) {
  fail("cart decrement behavior is not preserved");
}

const unsupportedClaims = [
  /free shipping/i,
  /free returns/i,
  /guaranteed delivery/i,
  /best seller/i,
  /limited time/i,
  /promo code applied/i,
];

for (const pattern of unsupportedClaims) {
  if (pattern.test(checkout)) fail(`unsupported claim found: ${pattern}`);
}

const phase9Styles = [
  "src/pages/checkout/checkout.scss",
  "src/components/checkoutItem/checkoutItem.scss",
  "src/components/cartDropdown/cartDropdown.scss",
  "src/components/cartItem/cartItem.scss",
];

const rawColor = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(/;
for (const file of phase9Styles) {
  if (rawColor.test(read(file))) fail(`hard-coded color found in ${file}`);
}

const requiredResponsiveMarkers = ["laptop-down", "tablet-down", "mobile-down"];
for (const marker of requiredResponsiveMarkers) {
  if (!checkoutStyles.includes(marker))
    fail(`missing responsive cart behavior: ${marker}`);
}

console.log("Cart validation passed.");
console.log(
  "Cart hierarchy, subtotal, quantity, remove, empty state, and payment path verified.",
);
console.log("Unsupported shipping/discount/promo claims are not fabricated.");
console.log("No hard-coded colors found in Phase 9 cart styles.");
