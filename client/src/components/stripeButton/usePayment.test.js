import { act, renderHook } from "@testing-library/react";
import { usePayment } from "@/components/stripeButton/usePayment";
import { useCardPayment } from "@/components/stripeButton/PaymentProvider";
import { submitPayment } from "@/api/paymentApi";

jest.mock("@/components/stripeButton/PaymentProvider", () => ({
  useCardPayment: jest.fn(),
}));
jest.mock("@/api/paymentApi", () => ({ submitPayment: jest.fn() }));

let card;
beforeEach(() => {
  card = {
    ready: true,
    createToken: jest.fn().mockResolvedValue({ id: "tok_test" }),
    clear: jest.fn(),
  };
  useCardPayment.mockReturnValue(card);
  submitPayment.mockResolvedValue({});
});
const event = () => ({ preventDefault: jest.fn() });
const completeCard = (result) =>
  act(() => result.current.handleCardChange({ complete: true }));

it("only submits a complete card and records success after the API succeeds", async () => {
  const onSuccess = jest.fn();
  const { result } = renderHook(() => usePayment({ price: 12.5, onSuccess }));
  await act(() => result.current.handleSubmit(event()));
  expect(submitPayment).not.toHaveBeenCalled();
  expect(result.current.visibleError).toMatch(/Complete your card/);
  completeCard(result);
  await act(() => result.current.handleSubmit(event()));
  expect(submitPayment).toHaveBeenCalledWith({
    amount: 1250,
    token: { id: "tok_test" },
  });
  expect(card.clear).toHaveBeenCalledTimes(1);
  expect(onSuccess).toHaveBeenCalledTimes(1);
  expect(result.current.isComplete).toBe(true);
});

it("blocks simultaneous and post-success submissions", async () => {
  let resolvePayment;
  submitPayment.mockImplementation(
    () =>
      new Promise((resolve) => {
        resolvePayment = resolve;
      }),
  );
  const { result } = renderHook(() => usePayment({ price: 20 }));
  completeCard(result);
  let pending;
  await act(async () => {
    pending = result.current.handleSubmit(event());
    await result.current.handleSubmit(event());
  });
  expect(submitPayment).toHaveBeenCalledTimes(1);
  await act(async () => {
    resolvePayment({});
    await pending;
  });
  await act(() => result.current.handleSubmit(event()));
  expect(submitPayment).toHaveBeenCalledTimes(1);
});

it("recovers from tokenization exceptions without sending payment or clearing the bag", async () => {
  card.createToken.mockRejectedValueOnce(new Error("SDK unavailable"));
  const onSuccess = jest.fn();
  const { result } = renderHook(() => usePayment({ price: 20, onSuccess }));
  completeCard(result);
  await act(() => result.current.handleSubmit(event()));
  expect(result.current.isLoading).toBe(false);
  expect(result.current.visibleError).toBeTruthy();
  expect(submitPayment).not.toHaveBeenCalled();
  expect(onSuccess).not.toHaveBeenCalled();
  await act(() => result.current.handleSubmit(event()));
  expect(onSuccess).toHaveBeenCalledTimes(1);
});

it("does not treat a rejected payment as success", async () => {
  submitPayment.mockRejectedValueOnce(new Error("Declined"));
  const onSuccess = jest.fn();
  const { result } = renderHook(() => usePayment({ price: 20, onSuccess }));
  completeCard(result);
  await act(() => result.current.handleSubmit(event()));
  expect(result.current.isComplete).toBe(false);
  expect(result.current.visibleError).toBeTruthy();
  expect(card.clear).not.toHaveBeenCalled();
  expect(onSuccess).not.toHaveBeenCalled();
});
