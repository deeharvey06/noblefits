const express = require("express");
const path = require("path");
const compression = require("compression");
const { createPaymentHandler } = require("./payment.cjs");

const createApp = ({ payments = null, serveFrontend = false } = {}) => {
  const app = express();
  app.disable("x-powered-by");
  app.use(compression());
  app.use(express.json({ limit: "16kb" }));
  app.post("/payment", createPaymentHandler(payments));

  if (serveFrontend) {
    const buildDirectory = path.join(__dirname, "..", "client/build");
    app.use(express.static(buildDirectory));
    app.get("*", (_req, res) =>
      res.sendFile(path.join(buildDirectory, "index.html")),
    );
  }

  // Never echo parser details or payment payloads back to the browser.
  // Express recognizes error middleware by its four-argument signature.
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    return res
      .status(error.status === 413 ? 413 : 400)
      .json({ error: "Invalid request." });
  });
  return app;
};

module.exports = { createApp };
