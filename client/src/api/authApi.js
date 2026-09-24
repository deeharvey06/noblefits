import {
  createAuthUser,
  getCurrentUser,
  getUserProfileSnapshot,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
} from "@/api/firebaseClient";

const getProfile = async (user, additionalData) => {
  const snapshot = await getUserProfileSnapshot(user, additionalData);
  if (!snapshot || !snapshot.exists())
    throw new Error("The user profile could not be loaded.");
  const data = snapshot.data();
  const createdAt =
    typeof data.createdAt?.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : data.createdAt || null;
  return { ...data, id: snapshot.id, createdAt };
};

// Public methods return profile data; Firebase users and snapshots stay inside the API layer.
export const authApi = {
  getSession: async () => {
    const user = await getCurrentUser();
    return user ? getProfile(user) : null;
  },
  signInWithEmail: async (email, password) => {
    const { user } = await signInWithEmail(email, password);
    return getProfile(user);
  },
  signInWithGoogle: async () => {
    const { user } = await signInWithGoogle();
    return getProfile(user);
  },
  signUp: async ({ email, password, displayName }) => {
    const { user } = await createAuthUser(email, password);
    return getProfile(user, { displayName });
  },
  signOut: signOutUser,
  resetPassword: sendPasswordReset,
};
