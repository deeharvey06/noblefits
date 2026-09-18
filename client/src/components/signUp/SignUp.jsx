import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, InputField } from "../../design-system";
import { clearUserError, signUpStart } from "../../redux/user/actions";
import {
  selectUserError,
  selectUserErrorContext,
  selectUserStatus,
} from "../../redux/user/userSelector";
import { getSignUpErrorMessage } from "../../utils/authMessages";

import "./signUp.scss";

const SignUp = () => {
  const dispatch = useDispatch();
  const authError = useSelector(selectUserError);
  const errorContext = useSelector(selectUserErrorContext);
  const status = useSelector(selectUserStatus);
  const [credentials, setCredentials] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const { displayName, email, password, confirmPassword } = credentials;
  const isSubmitting = status === "submitting";
  const authMessage =
    errorContext === "sign-up" ? getSignUpErrorMessage(authError) : "";
  const confirmPasswordError =
    formError === "Passwords must match." ? formError : "";
  const errorMessage =
    authMessage || (formError && !confirmPasswordError ? formError : "");

  const handleChange = ({ target: { name, value } }) => {
    setCredentials((current) => ({ ...current, [name]: value }));
    if (formError) setFormError("");
    if (authError) dispatch(clearUserError());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords must match.");
      return;
    }

    dispatch(
      signUpStart({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      }),
    );
  };

  return (
    <section
      className="auth-panel auth-panel--signup"
      aria-labelledby="sign-up-title"
    >
      <div className="auth-panel__heading">
        <p className="auth-panel__eyebrow">New here?</p>
        <h2 id="sign-up-title">Create your account</h2>
        <p>Set up your Noble Fits identity with a name, email, and password.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <InputField
          type="text"
          name="displayName"
          value={displayName}
          label="Display name"
          onChange={handleChange}
          autoComplete="name"
          required
        />
        <InputField
          type="email"
          name="email"
          value={email}
          label="Email address"
          onChange={handleChange}
          autoComplete="email"
          inputMode="email"
          required
        />
        <InputField
          type="password"
          name="password"
          value={password}
          label="Password"
          hint="Use a password you do not reuse elsewhere."
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <InputField
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          label="Confirm password"
          onChange={handleChange}
          autoComplete="new-password"
          error={confirmPasswordError}
          required
        />

        {errorMessage && (
          <p className="auth-form__error" role="alert">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          disabled={!displayName || !email || !password || !confirmPassword}
        >
          Create account
        </Button>
      </form>
    </section>
  );
};

export default SignUp;
