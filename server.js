const { createApp } = require("./server/app.cjs");
const { createPaymentClient } = require("./server/payment.cjs");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = createApp({
  payments: createPaymentClient(process.env.STRIPE_SECRET_KEY),
  serveFrontend: process.env.NODE_ENV === "production",
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
