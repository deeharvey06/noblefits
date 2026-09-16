export const getSignInErrorMessage = (error) => {
  if (!error) return "";

  if (error.code === "auth/network-request-failed") {
    return "We could not reach the sign-in service. Check your connection and try again.";
  }

  return "We could not sign you in with those details. Check your email and password and try again.";
};

export const getSignUpErrorMessage = (error) => {
  if (!error) return "";

  if (error.code === "auth/network-request-failed") {
    return "We could not reach the account service. Check your connection and try again.";
  }

  if (error.code === "auth/weak-password") {
    return "Choose a stronger password and try again.";
  }

  return "We could not create the account. Review your details or try signing in instead.";
};

export const getPasswordResetErrorMessage = (error) => {
  if (!error) return "";

  if (error.code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }

  if (error.code === "auth/network-request-failed") {
    return "We could not reach the account service. Check your connection and try again.";
  }

  return "We could not send the reset request. Try again.";
};
