import { ApiError, createHttpClient } from "@/api/httpClient";

it("unwraps response data and forwards cancellation without exposing the transport", async () => {
  const transport = {
    request: jest.fn().mockResolvedValue({ data: { ok: true } }),
  };
  const client = createHttpClient(transport);
  const { signal } = new AbortController();
  await expect(
    client.post("/example", { name: "Test" }, { signal }),
  ).resolves.toEqual({ ok: true });
  expect(transport.request).toHaveBeenCalledWith({
    method: "POST",
    url: "/example",
    data: { name: "Test" },
    signal,
  });
});

it("normalizes server errors without exposing request credentials or retrying", async () => {
  const transport = {
    request: jest.fn().mockRejectedValue({
      response: { status: 503 },
      code: "ERR_BAD_RESPONSE",
      config: { token: "private" },
    }),
  };
  const error = await createHttpClient(transport)
    .get("/example")
    .catch((value) => value);
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({
    status: 503,
    code: "ERR_BAD_RESPONSE",
    aborted: false,
  });
  expect(error.config).toBeUndefined();
  expect(transport.request).toHaveBeenCalledTimes(1);
});

it("marks cancellation as an aborted request", async () => {
  const client = createHttpClient({
    request: jest.fn().mockRejectedValue({ code: "ERR_CANCELED" }),
  });
  await expect(client.get("/example")).rejects.toMatchObject({ aborted: true });
});
