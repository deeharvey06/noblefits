const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("./app.cjs");

let server;
let baseUrl;
before(async () => {
  server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
});

const post = (body) =>
  fetch(`${baseUrl}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

test("HTTP endpoint works without a configured key and responds with service unavailable", async () => {
  const response = await post(
    JSON.stringify({ amount: 2500, token: { id: "tok_test" } }),
  );
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Test payments are not configured.",
  });
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("HTTP endpoint rejects an invalid payment payload", async () => {
  const response = await post(JSON.stringify({ amount: -10 }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /positive amount/);
});

test("malformed JSON returns a controlled error instead of parser diagnostics", async () => {
  const response = await post('{"private-data": invalid-json');
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});

test("oversized payment bodies are rejected by the request parser", async () => {
  const response = await post(JSON.stringify({ value: "x".repeat(20000) }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Invalid request." });
});
