import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ForgotPasswordPage from "@/pages/forgotPassword/ForgotPasswordPage";
import { authApi } from "@/api/authApi";

jest.mock("@/api/authApi", () => ({ authApi: { resetPassword: jest.fn() } }));
const submit = () => {
  render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText(/Email address/), {
    target: { value: " alex@example.com " },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Send reset instructions" }),
  );
};

it.each(["success", "not-found"])(
  "shows the same confirmation for %s without revealing account existence",
  async (outcome) => {
    if (outcome === "success")
      authApi.resetPassword.mockResolvedValueOnce(undefined);
    else
      authApi.resetPassword.mockRejectedValueOnce({
        code: "auth/user-not-found",
      });
    submit();
    expect(await screen.findByRole("status")).toHaveTextContent(
      "If an account exists for alex@example.com",
    );
    expect(authApi.resetPassword).toHaveBeenCalledWith("alex@example.com");
  },
);

it("allows correction after an invalid email response", async () => {
  authApi.resetPassword.mockRejectedValueOnce({ code: "auth/invalid-email" });
  submit();
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Enter a valid email address.",
  );
  fireEvent.change(screen.getByLabelText(/Email address/), {
    target: { value: "new@example.com" },
  });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Send reset instructions" }),
  ).toBeEnabled();
});
