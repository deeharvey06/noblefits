import { useState } from "react";
import { Link } from "react-router";

import { Button, InputField } from "../../design-system";
import { sendPasswordReset } from "../../firebase/firebase.utils";
import { getPasswordResetErrorMessage } from "../../utils/authMessages";

import "./forgotPasswordPage.scss";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      await sendPasswordReset(email.trim());
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

  return (
    <div className="password-reset-page ds-container">
      <section
        className="password-reset-card"
        aria-labelledby="password-reset-title"
      >
        <p className="password-reset-card__eyebrow">Account recovery</p>
        <h1 id="password-reset-title">Reset your password.</h1>

        {status === "success" ? (
          <div className="password-reset-card__success" role="status">
            <h2>Check your email</h2>
            <p>
              If an account exists for <strong>{email.trim()}</strong>, Firebase
              will send password reset instructions to that address.
            </p>
            <Link className="password-reset-card__back-link" to="/signin">
              Return to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="password-reset-card__intro">
              Enter the email address associated with your account. Password
              reset is handled by the same Firebase authentication service used
              for sign in.
            </p>

            <form
              className="password-reset-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <InputField
                type="email"
                name="resetEmail"
                value={email}
                label="Email address"
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                inputMode="email"
                error={error}
                required
              />

              <Button
                type="submit"
                fullWidth
                loading={status === "submitting"}
                disabled={!email.trim()}
              >
                Send reset instructions
              </Button>
            </form>

            <Link className="password-reset-card__back-link" to="/signin">
              Back to sign in
            </Link>
          </>
        )}
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
