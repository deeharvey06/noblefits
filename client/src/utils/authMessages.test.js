import {
  getPasswordResetErrorMessage,
  getSignInErrorMessage,
  getSignUpErrorMessage,
} from "./authMessages";

describe("auth messages", () => {
  it("keeps sign-in credential errors generic", () => {
    expect(getSignInErrorMessage({ code: "auth/user-not-found" })).toContain(
      "Check your email and password",
    );
    expect(getSignInErrorMessage({ code: "auth/wrong-password" })).toContain(
      "Check your email and password",
    );
  });

  it("provides useful network feedback", () => {
    expect(
      getSignInErrorMessage({ code: "auth/network-request-failed" }),
    ).toContain("connection");
  });

  it("provides safe sign-up and reset messages", () => {
    expect(getSignUpErrorMessage({ code: "auth/weak-password" })).toContain(
      "stronger password",
    );
    expect(
      getPasswordResetErrorMessage({ code: "auth/invalid-email" }),
    ).toContain("valid email");
  });
});
