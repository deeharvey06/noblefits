import { ROUTES } from "@/config/routes";
import { AppLink as Link } from "@/components/navigation/AppLink";
import { Button, InputField } from "@/design-system";
import { useSignIn } from "@/components/signIn/useSignIn";
import "./signIn.scss";

const SignIn = () => {
  const {
    email,
    password,
    isSubmitting,
    errorMessage,
    handleSubmit,
    handleChange,
    signInWithGoogle,
  } = useSignIn();

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
          <Link to={ROUTES.forgotPassword}>Forgot password?</Link>
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
          onClick={signInWithGoogle}
        >
          Continue with Google
        </Button>
      </form>
    </section>
  );
};

export default SignIn;
