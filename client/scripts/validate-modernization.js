const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "src");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const rootPackageJson = JSON.parse(
  fs.readFileSync(path.join(root, "..", "package.json"), "utf8"),
);
const allSourceFiles = [];

const collectFiles = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(fullPath);
    else if (/\.(js|jsx|scss|css)$/.test(entry.name))
      allSourceFiles.push(fullPath);
  }
};
collectFiles(sourceRoot);

// Vite 8/Oxc parses JSX according to the file extension. Keep JSX out of .js
// files so dependency scanning and transforms work without parser overrides.
const jsxInJavaScriptFiles = allSourceFiles
  .filter((file) => file.endsWith(".js"))
  .filter((file) =>
    /<[A-Za-z][A-Za-z0-9]*(?:\s|>|\/)/.test(fs.readFileSync(file, "utf8")),
  );

const source = allSourceFiles
  .map(
    (file) =>
      `\n/* ${path.relative(root, file)} */\n${fs.readFileSync(file, "utf8")}`,
  )
  .join("\n");

const failures = [];
if (jsxInJavaScriptFiles.length) {
  failures.push(
    `JSX must use .jsx files for Vite 8/Oxc. Rename: ${jsxInJavaScriptFiles
      .map((file) => path.relative(root, file))
      .join(", ")}`,
  );
}
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
const bannedDependencies = [
  "react-scripts",
  "node-sass",
  "styled-components",
  "react-router-dom",
  "redux-logger",
  "redux-thunk",
  "react-stripe-checkout",
];

for (const dependency of bannedDependencies) {
  if (dependencies[dependency])
    failures.push(`Legacy dependency still present: ${dependency}`);
}

if (!rootPackageJson.devDependencies?.jest) {
  failures.push("Required test runner missing: Jest");
}

const requiredDependencies = [
  "react",
  "react-dom",
  "react-router",
  "@reduxjs/toolkit",
  "firebase",
  "vite",
  "sass",

  "@stripe/react-stripe-js",
  "@stripe/stripe-js",
];
for (const dependency of requiredDependencies) {
  if (!dependencies[dependency])
    failures.push(`Required modern dependency missing: ${dependency}`);
}

const bannedSourcePatterns = [
  ["react-router-dom", /react-router-dom/],
  ["legacy ReactDOM.render", /ReactDOM\.render\s*\(/],
  ["withRouter", /\bwithRouter\b/],
  ["useHistory", /\buseHistory\b/],
  ["CRA env variables", /process\.env\.REACT_APP_/],
  [
    "legacy Firebase namespace import",
    /import\s+firebase\s+from\s+["']firebase/,
  ],
  ["Sass @import", /@import\s+["'][^"']+["']/],
  ["createStructuredSelector RTK misuse", /createStructuredSelector/],
  ["react-stripe-checkout", /react-stripe-checkout/],
];
for (const [label, pattern] of bannedSourcePatterns) {
  if (pattern.test(source))
    failures.push(`Legacy source pattern still present: ${label}`);
}

const requiredFiles = [
  "vite.config.mjs",
  "eslint.config.mjs",
  "index.html",
  ".env.example",
  "src/setupTests.js",
  "src/redux/cart/cartUtils.test.js",
  "src/components/signUp/SignUp.test.jsx",
  "src/components/stripeButton/stripeButton.scss",
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file)))
    failures.push(`Modernization file missing: ${file}`);
}

const signup = fs.readFileSync(
  path.join(sourceRoot, "components/signUp/SignUp.jsx"),
  "utf8",
);
if (!/setCredentials\(\((currentCredentials|current)\)/.test(signup)) {
  failures.push("Sign Up controlled-state bug is not fixed.");
}

const cartReducer = fs.readFileSync(
  path.join(sourceRoot, "redux/cart/cartReducer.js"),
  "utf8",
);
if (!cartReducer.includes("decrementItemInCart")) {
  failures.push("Cart decrement action is not using decrementItemInCart.");
}

const directoryReducer = fs.readFileSync(
  path.join(sourceRoot, "redux/directory/directoryReducer.js"),
  "utf8",
);
if (!directoryReducer.includes('title: "mens"')) {
  failures.push("Mens directory tile title is still missing.");
}

const stripeButton = fs.readFileSync(
  path.join(sourceRoot, "components/stripeButton/StripeButton.jsx"),
  "utf8",
);
if (!stripeButton.includes("VITE_STRIPE_PUBLISHABLE_KEY")) {
  failures.push(
    "Stripe publishable key is not using Vite environment variables.",
  );
}
if (!stripeButton.includes("stripe.createToken(cardElement)")) {
  failures.push(
    "Stripe adapter no longer preserves the existing token-based /payment contract.",
  );
}

const checkoutItem = fs.readFileSync(
  path.join(sourceRoot, "components/checkoutItem/CheckoutItem.jsx"),
  "utf8",
);
if (!checkoutItem.includes("<button")) {
  failures.push("Checkout quantity/remove controls are not semantic buttons.");
}

const nodeEngine = String(packageJson.engines?.node || "");
if (!(nodeEngine.includes("20.19") && nodeEngine.includes("22.12"))) {
  failures.push(
    "Client Node engine is not aligned with Vite 8 support (Node 20.19+ or 22.12+).",
  );
}

if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}

console.log("Frontend modernization validation passed.");
console.log(`${allSourceFiles.length} source/style files scanned.`);
console.log(
  "Legacy CRA/router/Firebase/Sass/Stripe wrapper patterns are absent.",
);
console.log(
  "Known Sign Up, cart decrement, Mens tile, Stripe env, and semantic-control fixes are present.",
);
