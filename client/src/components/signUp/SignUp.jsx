import { Button, InputField } from "@/design-system";
import { useSignUp } from "@/components/signUp/useSignUp";
import "./signUp.scss";

const SignUp = () => {
  const {
    displayName,
    email,
    password,
    confirmPassword,
    isSubmitting,
    confirmPasswordError,
    errorMessage,
    handleSubmit,
    handleChange,
  } = useSignUp();

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
