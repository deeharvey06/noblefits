import { httpClient } from "@/api/httpClient";
import { submitPayment } from "@/api/paymentApi";

jest.mock("@/api/httpClient", () => ({ httpClient: { post: jest.fn() } }));

it("preserves the existing server payment contract", async () => {
  const token = { id: "tok_test" };
  await submitPayment({ amount: 1250, token });
  expect(httpClient.post).toHaveBeenCalledWith(
    "/payment",
    { amount: 1250, token },
    undefined,
  );
});

it.each([0, -1, NaN, Infinity, 1.5])(
  "does not send invalid amounts (%s)",
  async (amount) => {
    await expect(
      submitPayment({ amount, token: { id: "tok_test" } }),
    ).rejects.toThrow();
    expect(httpClient.post).not.toHaveBeenCalled();
  },
);
