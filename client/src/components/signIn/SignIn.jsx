import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import { Button, InputField } from "../../design-system";
import {
  clearUserError,
  emailSignInStart,
  googleSignInStart,
} from "../../redux/user/actions";
import {
  selectUserError,
  selectUserErrorContext,
  selectUserStatus,
} from "../../redux/user/userSelector";
import { getSignInErrorMessage } from "../../utils/authMessages";

import "./signIn.scss";

const SignIn = () => {
  const dispatch = useDispatch();
  const authError = useSelector(selectUserError);
  const errorContext = useSelector(selectUserErrorContext);
  const status = useSelector(selectUserStatus);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const { email, password } = credentials;
  const isSubmitting = status === "submitting";
  const errorMessage =
    errorContext === "sign-in" ? getSignInErrorMessage(authError) : "";

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(emailSignInStart({ email: email.trim(), password }));
  };

  const handleChange = ({ target: { name, value } }) => {
    setCredentials((current) => ({ ...current, [name]: value }));
    if (authError) dispatch(clearUserError());
  };

  return (
    <section
      className="auth-panel auth-panel--signin"
      aria-labelledby="sign-in-title"
    >
      <div className="auth-panel__heading">
        <p className="auth-panel__eyebrow">Welcome back</p>
        <h2 id="sign-in-title">Sign in to Noble Fits</h2>
        <p>Use your email and password, or continue with Google.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <div className="auth-form__support-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {errorMessage && (
          <p className="auth-form__error" role="alert">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          disabled={!email || !password}
        >
          Sign in
        </Button>

        <div className="auth-form__separator" aria-hidden="true">
          <span>or</span>
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isSubmitting}
          onClick={() => dispatch(googleSignInStart())}
        >
          Continue with Google
        </Button>
      </form>
    </section>
  );
};

export default SignIn;
