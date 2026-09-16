const readEnv = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

// Firebase web-app configuration is public client metadata, not a server secret.
// Environment overrides make staging/production projects deployable without code changes.
export const firebaseConfig = {
  apiKey: readEnv(
    import.meta.env.VITE_FIREBASE_API_KEY,
    "AIzaSyCMpJR-JkAFr0iHKH_GqnyPQMAV_YQs0Xw"
  ),
  authDomain: readEnv(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    "noblefit-db.firebaseapp.com"
  ),
  projectId: readEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "noblefit-db"),
  storageBucket: readEnv(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    "noblefit-db.appspot.com"
  ),
  messagingSenderId: readEnv(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    "216957106939"
  ),
  appId: readEnv(
    import.meta.env.VITE_FIREBASE_APP_ID,
    "1:216957106939:web:d58572a326a9e739e6ce5e"
  ),
  measurementId: readEnv(
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    "G-0KW67CNG82"
  ),
};

const configuredStripeKey = readEnv(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
export const stripePublishableKey =
  configuredStripeKey && !configuredStripeKey.includes("replace_me")
    ? configuredStripeKey
    : "";

export const isStripeTestMode = stripePublishableKey.startsWith("pk_test_");
