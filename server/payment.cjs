// This portfolio's payment endpoint is a test-mode integration, not a live checkout.
const createPaymentClient = (secretKey, createStripe = require("stripe")) => {
  if (!secretKey || secretKey.includes("replace_me")) return null;
  if (!secretKey.startsWith("sk_test_")) {
    throw new Error(
      "This demo requires a Stripe test secret key (sk_test_). Live payments are disabled.",
    );
  }
  return createStripe(secretKey);
};

const createPaymentHandler = (payments) => (req, res) => {
  const { amount, token } = req.body || {};
  if (
    !Number.isSafeInteger(amount) ||
    amount <= 0 ||
    typeof token?.id !== "string" ||
    !/^tok_[A-Za-z0-9_]+$/.test(token.id)
  ) {
    return res.status(400).json({
      error:
        "A positive amount in cents and a valid payment token are required.",
    });
  }
  if (!payments)
    return res.status(503).json({ error: "Test payments are not configured." });

  payments.charges.create(
    { source: token.id, amount, currency: "usd" },
    (error, charge) => {
      if (error) {
        const declined = error.type === "StripeCardError";
        return res.status(declined ? 402 : 502).json({
          error: declined
            ? "The card was declined."
            : "The payment provider could not complete the request.",
        });
      }
      return res.status(200).json({
        success: {
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
        },
      });
    },
  );
};

module.exports = { createPaymentClient, createPaymentHandler };
