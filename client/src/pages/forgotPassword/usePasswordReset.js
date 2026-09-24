import { useState } from "react";

import { authApi } from "@/api/authApi";
import { getPasswordResetErrorMessage } from "@/utils/authMessages";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;
    setError("");
    setStatus("submitting");

    try {
      await authApi.resetPassword(email.trim());
      setStatus("success");
    } catch (requestError) {
      // Avoid confirming whether an account exists for a submitted address.
      if (requestError?.code === "auth/user-not-found") {
        setStatus("success");
        return;
      }

      setError(getPasswordResetErrorMessage(requestError));
      setStatus("idle");
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (error) setError("");
  };

  return { email, status, error, handleSubmit, handleChange };
};
