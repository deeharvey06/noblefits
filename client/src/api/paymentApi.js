import { httpClient } from "@/api/httpClient";

const PAYMENT_ENDPOINT = "/payment";

export const submitPayment = ({ amount, token }, options) => {
  if (!Number.isSafeInteger(amount) || amount <= 0 || !token?.id) {
    return Promise.reject(
      new Error("A positive amount and payment token are required."),
    );
  }
  // Payment mutations are never automatically retried.
  return httpClient.post(PAYMENT_ENDPOINT, { amount, token }, options);
};
