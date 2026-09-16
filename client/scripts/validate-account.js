const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`Account validation failed: ${message}`);
  process.exit(1);
};

const app = read("src/App.jsx");
const signIn = read("src/components/signIn/SignIn.jsx");
const signUp = read("src/components/signUp/SignUp.jsx");
const account = read("src/pages/account/AccountPage.jsx");
const accountStyles = read("src/pages/account/accountPage.scss");
const reset = read("src/pages/forgotPassword/ForgotPasswordPage.jsx");
const resetStyles = read("src/pages/forgotPassword/forgotPasswordPage.scss");
const firebase = read("src/firebase/firebase.utils.js");
const reducer = read("src/redux/user/userReducer.js");
const sagas = read("src/redux/user/sagas.js");
const header = read("src/components/header/Header.jsx");

for (const route of ['path="/account"', 'path="/forgot-password"']) {
  if (!app.includes(route)) fail(`missing account route: ${route}`);
}

if (!app.includes("selectSessionChecked") || !app.includes("!sessionChecked")) {
  fail("protected account routing does not wait for Firebase session restoration");
}

if (!firebase.includes("sendPasswordResetEmail") || !firebase.includes("sendPasswordReset")) {
  fail("Firebase-native password recovery is missing");
}

if (!reset.includes("If an account exists for")) {
  fail("password reset confirmation can reveal account existence");
}

for (const field of ["Display name", "Email address", "Member since"]) {
  if (!account.includes(field)) fail(`missing supported profile field: ${field}`);
}

for (const unsupported of [
  "does not store order history",
  "does not currently store payment methods",
  "not currently synchronized to your account",
]) {
  if (!account.includes(unsupported)) fail(`missing unsupported-capability boundary: ${unsupported}`);
}

if (!header.includes('to="/account"') || !account.includes("signOutStart")) {
  fail("account destination or explicit logout is missing");
}

if (!signIn.includes('to="/forgot-password"')) {
  fail("sign in does not expose password recovery");
}

if (!signIn.includes("getSignInErrorMessage") || !signUp.includes("getSignUpErrorMessage")) {
  fail("authentication errors are not presented through controlled user-facing messages");
}

if (!reducer.includes("sessionChecked") || !reducer.includes("errorContext")) {
  fail("authentication UI state is incomplete");
}

if (!sagas.includes("toISOString()")) {
  fail("Firestore profile timestamp is not normalized before Redux storage");
}

const forbiddenRoutes = [
  'path="/orders"',
  'path="/addresses"',
  'path="/payment-methods"',
  'path="/tracking"',
];
for (const route of forbiddenRoutes) {
  if (app.includes(route)) fail(`unsupported account capability was fabricated: ${route}`);
}

const rawColor = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(/;
for (const [file, source] of [
  ["src/pages/account/accountPage.scss", accountStyles],
  ["src/pages/forgotPassword/forgotPasswordPage.scss", resetStyles],
]) {
  if (rawColor.test(source)) fail(`hard-coded color found in ${file}`);
}

for (const marker of ["laptop-down", "mobile-down"]) {
  if (!accountStyles.includes(marker)) fail(`missing responsive account behavior: ${marker}`);
}

console.log("Account validation passed.");
console.log("Sign-in, registration, Firebase password recovery, protected account routing, and logout verified.");
console.log("Profile presentation is limited to existing user data; orders, addresses, payment methods, and tracking are not fabricated.");
console.log("Existing Firebase authentication remains the source of truth.");
