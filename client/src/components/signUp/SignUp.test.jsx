import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import SignUp from "./SignUp";

const renderSignUp = () => {
  const store = configureStore({
    reducer: () => ({
      user: {
        currentUser: null,
        error: null,
        errorContext: null,
        status: "idle",
        sessionChecked: true,
      },
    }),
  });

  return render(
    <Provider store={store}>
      <SignUp />
    </Provider>
  );
};

describe("SignUp", () => {
  it("updates all controlled fields without throwing", () => {
    renderSignUp();

    fireEvent.change(screen.getByLabelText(/display name/i), {
      target: { value: "Alex", name: "displayName" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "alex@example.com", name: "email" },
    });

    expect(screen.getByLabelText(/display name/i)).toHaveValue("Alex");
    expect(screen.getByLabelText(/email address/i)).toHaveValue("alex@example.com");
  });

  it("shows an accessible error when passwords do not match", () => {
    renderSignUp();

    fireEvent.change(screen.getByLabelText(/display name/i), {
      target: { value: "Alex", name: "displayName" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "alex@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "one-password", name: "password" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "different-password", name: "confirmPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    const confirmPassword = screen.getByLabelText(/confirm password/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/passwords must match/i);
    expect(confirmPassword).toHaveAttribute("aria-invalid", "true");
    expect(confirmPassword).toHaveAttribute("aria-errormessage", "confirmPassword-message");
  });
});
