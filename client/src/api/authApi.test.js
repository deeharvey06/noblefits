import { authApi } from "@/api/authApi";
import {
  createAuthUser,
  getCurrentUser,
  getUserProfileSnapshot,
  signInWithEmail,
} from "@/api/firebaseClient";

jest.mock("@/api/firebaseClient", () => ({
  createAuthUser: jest.fn(),
  getCurrentUser: jest.fn(),
  getUserProfileSnapshot: jest.fn(),
  signInWithEmail: jest.fn(),
  signInWithGoogle: jest.fn(),
  signOutUser: jest.fn(),
  sendPasswordReset: jest.fn(),
}));

const user = { uid: "user-1", getIdToken: jest.fn() };
beforeEach(() => {
  getUserProfileSnapshot.mockResolvedValue({
    id: "user-1",
    exists: () => true,
    data: () => ({
      displayName: "Alex",
      email: "alex@example.com",
      createdAt: { toDate: () => new Date("2025-01-01T00:00:00Z") },
    }),
  });
});

it("returns a serializable profile from email authentication", async () => {
  signInWithEmail.mockResolvedValue({ user });
  const profile = await authApi.signInWithEmail("alex@example.com", "password");
  expect(profile).toEqual({
    id: "user-1",
    displayName: "Alex",
    email: "alex@example.com",
    createdAt: "2025-01-01T00:00:00.000Z",
  });
  expect(JSON.parse(JSON.stringify(profile))).toEqual(profile);
  expect(profile.getIdToken).toBeUndefined();
});

it("returns no profile for an anonymous session", async () => {
  getCurrentUser.mockResolvedValue(null);
  await expect(authApi.getSession()).resolves.toBeNull();
  expect(getUserProfileSnapshot).not.toHaveBeenCalled();
});

it("creates the profile during registration before returning to the store", async () => {
  createAuthUser.mockResolvedValue({ user });
  await expect(
    authApi.signUp({
      email: "alex@example.com",
      password: "password",
      displayName: "Alex",
    }),
  ).resolves.toMatchObject({ id: "user-1" });
  expect(getUserProfileSnapshot).toHaveBeenCalledWith(user, {
    displayName: "Alex",
  });
});

it("preserves authentication error codes for feature error messages", async () => {
  signInWithEmail.mockRejectedValue({ code: "auth/invalid-credential" });
  await expect(
    authApi.signInWithEmail("alex@example.com", "wrong"),
  ).rejects.toMatchObject({ code: "auth/invalid-credential" });
});
