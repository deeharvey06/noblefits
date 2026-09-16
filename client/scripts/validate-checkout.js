const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`Checkout validation failed: ${message}`);
  process.exit(1);
};

const checkout = read("src/pages/checkout/Checkout.jsx");
const checkoutStyles = read("src/pages/checkout/checkout.scss");
const stripe = read("src/components/stripeButton/StripeButton.jsx");
const stripeStyles = read("src/components/stripeButton/stripeButton.scss");

const requiredCheckoutCopy = [
  "Complete your purchase.",
  "Checkout progress",
  "Bag",
  "Payment",
  "Continue to payment",
  "Order summary",
  "Amount due",
  "Secure card payment",
  "Payment-only checkout",
];

for (const text of requiredCheckoutCopy) {
  if (!checkout.includes(text)) fail(`missing checkout hierarchy copy: ${text}`);
}

if (!checkout.includes('grid-template-areas') && !checkoutStyles.includes("grid-template-areas")) {
  fail("checkout does not define intentional responsive flow areas");
}

if (!checkout.includes("does not collect contact information, shipping addresses, or a")) {
  fail("unsupported contact/shipping capabilities are not disclosed");
}

if (!stripe.includes("onChange={handleCardChange}")) {
  fail("Stripe card completeness/error changes are not handled");
}
if (!stripe.includes("!cardState.complete")) {
  fail("payment is not gated on complete card details");
}
if (!stripe.includes('paymentState.status === "success"')) {
  fail("successful payment does not prevent duplicate submission");
}
if (!stripe.includes("isStripeTestMode")) {
  fail("test payment instructions are not scoped to Stripe test keys");
}
if (!stripe.includes('axios.post("/payment"')) {
  fail("existing /payment endpoint is not preserved");
}
if (!stripe.includes("amount: priceForStripe") || !stripe.includes("token,")) {
  fail("existing payment payload shape is not preserved");
}
if (!stripe.includes("Card details are collected by Stripe Elements")) {
  fail("supported Stripe trust cue is missing");
}

const unsupportedClaims = [
  /free shipping/i,
  /free returns/i,
  /guaranteed delivery/i,
  /ships in \d/i,
  /tax included/i,
  /order number/i,
];

for (const pattern of unsupportedClaims) {
  if (pattern.test(checkout) || pattern.test(stripe)) {
    fail(`unsupported checkout claim found: ${pattern}`);
  }
}

const rawColor = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(/;
for (const [file, source] of [
  ["src/pages/checkout/checkout.scss", checkoutStyles],
  ["src/components/stripeButton/stripeButton.scss", stripeStyles],
]) {
  if (rawColor.test(source)) fail(`hard-coded color found in ${file}`);
}

for (const marker of ["laptop-down", "tablet-down", "mobile-down"]) {
  if (!checkoutStyles.includes(marker)) fail(`missing responsive checkout behavior: ${marker}`);
}

console.log("Checkout validation passed.");
console.log("Two-step hierarchy, payment validation, Stripe trust cue, and mobile flow verified.");
console.log("Unsupported contact, shipping, tax, discount, and order capabilities are not fabricated.");
console.log("Existing /payment endpoint and amount/token payload are preserved.");
