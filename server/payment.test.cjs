const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createPaymentClient, createPaymentHandler } = require("./payment.cjs");

const response = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});
const validBody = { amount: 2500, token: { id: "tok_test" } };

test("demo can start without a payment key and refuses live keys", () => {
  assert.equal(createPaymentClient(undefined), null);
  assert.equal(createPaymentClient("sk_test_replace_me"), null);
  assert.throws(
    () => createPaymentClient("sk_live_not_a_real_key"),
    /Live payments are disabled/,
  );
  assert.equal(
    createPaymentClient("sk_test_example", () => "test-client"),
    "test-client",
  );
});

test("unconfigured payment requests receive a controlled unavailable response", () => {
  const res = response();
  createPaymentHandler(null)({ body: validBody }, res);
  assert.equal(res.statusCode, 503);
});

for (const body of [
  undefined,
  {},
  { ...validBody, amount: -1 },
  { ...validBody, amount: 1.5 },
  { ...validBody, amount: "2500" },
  { ...validBody, amount: Infinity },
  { ...validBody, token: {} },
]) {
  test(`rejects malformed payment before calling Stripe: ${JSON.stringify(body)}`, () => {
    const res = response();
    const payments = {
      charges: { create: () => assert.fail("Must not call Stripe") },
    };
    createPaymentHandler(payments)({ body }, res);
    assert.equal(res.statusCode, 400);
  });
}

test("preserves the amount/token contract and returns only confirmation data", () => {
  const res = response();
  const payments = {
    charges: {
      create(body, callback) {
        assert.deepEqual(body, {
          source: "tok_test",
          amount: 2500,
          currency: "usd",
        });
        callback(null, {
          id: "ch_test",
          amount: 2500,
          currency: "usd",
          source: { privateCardDetails: true },
        });
      },
    },
  };
  createPaymentHandler(payments)({ body: validBody }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: { id: "ch_test", amount: 2500, currency: "usd" },
  });
});

for (const [type, status] of [
  ["StripeCardError", 402],
  ["StripeAPIError", 502],
]) {
  test(`handles ${type} without exposing the provider response`, () => {
    const res = response();
    const payments = {
      charges: {
        create(_body, callback) {
          callback({ type, message: "private provider data" });
        },
      },
    };
    createPaymentHandler(payments)({ body: validBody }, res);
    assert.equal(res.statusCode, status);
    assert.doesNotMatch(JSON.stringify(res.body), /private provider data/);
  });
}
