import { useRef, useState } from "react";
import { submitPayment } from "@/api/paymentApi";
import { useCardPayment } from "@/components/stripeButton/PaymentProvider";
import { formatMoney } from "@/utils/formatMoney";

export const usePayment = ({ price, onSuccess }) => {
  const card = useCardPayment();
  const submitting = useRef(false);
  const completed = useRef(false);
  const [cardState, setCardState] = useState({ complete: false, error: "" });
  const [paymentState, setPaymentState] = useState({
    status: "idle",
    message: "",
  });
  const amount = Math.round(Number(price) * 100);
  const validAmount = Number.isSafeInteger(amount) && amount > 0;
  const isLoading = paymentState.status === "loading";
  const isComplete = paymentState.status === "success";

  const handleCardChange = (event) => {
    setCardState({
      complete: Boolean(event.complete),
      error: event.error?.message || "",
    });
    if (paymentState.status === "error")
      setPaymentState({ status: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!card.ready || !validAmount || submitting.current || completed.current)
      return;
    if (!cardState.complete) {
      setPaymentState({
        status: "error",
        message: cardState.error || "Complete your card details before paying.",
      });
      return;
    }

    submitting.current = true;
    setPaymentState({ status: "loading", message: "Processing payment…" });
    try {
      const token = await card.createToken();
      await submitPayment({ amount, token });
    } catch {
      setPaymentState({
        status: "error",
        message:
          "There was an issue with your payment. Check your details and try again.",
      });
      return;
    } finally {
      submitting.current = false;
    }

    completed.current = true;
    setPaymentState({
      status: "success",
      message: "Payment completed successfully.",
    });
    setCardState({ complete: false, error: "" });
    card.clear();
    onSuccess?.();
  };

  return {
    validAmount,
    formattedPrice: formatMoney(price),
    handleCardChange,
    handleSubmit,
    paymentState,
    isLoading,
    isComplete,
    paymentDisabled:
      !card.ready ||
      !validAmount ||
      !cardState.complete ||
      isLoading ||
      isComplete,
    visibleError:
      cardState.error ||
      (paymentState.status === "error" ? paymentState.message : ""),
  };
};
