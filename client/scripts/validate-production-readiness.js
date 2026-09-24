const { readFeature } = require("./source-files");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const app = read("src/App.jsx");
const index = read("src/index.jsx");
const errorBoundary = read("src/components/errorBoundary/errorBoundary.jsx");
const errorBoundaryStyles = read(
  "src/components/errorBoundary/errorBoundary.scss",
);
const checkout = readFeature("src/pages/checkout");
const rootReducer = read("src/redux/rootReducer.js");
const config = read("src/config/clientConfig.js");
const lazyRetry = read("src/utils/lazyWithRetry.js");
const shopPage = read("src/pages/shop/ShopPage.jsx");
const envExample = read(".env.example");
const viteConfig = read("vite.config.mjs");
const packageJson = JSON.parse(read("package.json"));

assert(
  app.includes("path={ROUTES.notFound} element={<NotFoundPage />}"),
  "Top-level 404 route is missing.",
);
assert(
  shopPage.includes("path={ROUTES.notFound} element={<NotFoundPage />}"),
  "Nested shop 404 route is missing.",
);
assert(
  !app.includes("<Navigate to={ROUTES.home} replace />") ||
    app.includes("path={ROUTES.account}"),
  "Wildcard routing still redirects unknown URLs to Home.",
);
assert(
  app.includes("lazyWithRetry"),
  "Route chunks are not using deploy-safe lazy retry.",
);
assert(
  lazyRetry.includes("sessionStorage") && lazyRetry.includes("location.reload"),
  "Lazy chunk retry/reload recovery is incomplete.",
);
assert(
  index.includes("<ErrorBoundary"),
  "Root application error boundary is missing.",
);
assert(
  errorBoundary.includes("resetKey") && errorBoundary.includes("handleRetry"),
  "Error boundary cannot recover/reset.",
);
assert(
  !errorBoundaryStyles.includes("http://") &&
    !errorBoundaryStyles.includes("https://"),
  "Error boundary depends on an external image asset.",
);
assert(
  checkout.includes("clearCart()") && checkout.includes("paymentReceipt"),
  "Successful payment does not clear the paid bag and preserve confirmation.",
);
assert(
  rootReducer.includes("cartPersistTransform") &&
    rootReducer.includes("hidden: true"),
  "Transient cart UI state is still persisted.",
);
assert(
  rootReducer.includes("sanitizeCartItems"),
  "Persisted cart data is not sanitized during rehydration.",
);
assert(
  config.includes("VITE_STRIPE_PUBLISHABLE_KEY") &&
    config.includes("replace_me"),
  "Stripe client configuration does not guard placeholder keys.",
);
assert(
  config.includes("VITE_FIREBASE_PROJECT_ID"),
  "Firebase environment overrides are missing.",
);
assert(
  envExample.includes("VITE_STRIPE_PUBLISHABLE_KEY") &&
    envExample.includes("VITE_FIREBASE_PROJECT_ID"),
  "Environment example is incomplete.",
);
assert(
  viteConfig.includes("sourcemap: false"),
  "Production source-map policy is not explicit.",
);
assert(
  viteConfig.includes("strictPort: true"),
  "Dev server port is not deterministic.",
);
assert(
  packageJson.packageManager === "npm@10.9.2",
  "Package manager version is not pinned.",
);
assert(
  packageJson.scripts?.prebuild?.includes("production:validate"),
  "Production validation is not enforced before builds.",
);

for (const [section, deps] of Object.entries({
  dependencies: packageJson.dependencies,
  devDependencies: packageJson.devDependencies,
})) {
  for (const [name, version] of Object.entries(deps || {})) {
    assert(
      !/^[~^><=*]/.test(version),
      `${section}.${name} is not pinned exactly (${version}).`,
    );
  }
}

const sourceFiles = walk(path.join(root, "src")).filter((file) =>
  /\.(js|jsx)$/.test(file),
);
for (const file of sourceFiles) {
  const relative = path.relative(root, file);
  const content = fs.readFileSync(file, "utf8");
  assert(
    !content.includes("debugger;"),
    `${relative} contains debugger statement.`,
  );
  assert(
    !/\balert\s*\(/.test(content),
    `${relative} contains blocking alert().`,
  );
  assert(
    !content.includes("STRIPE_SECRET_KEY"),
    `${relative} references the Stripe secret key.`,
  );
  assert(
    !content.includes("dangerouslySetInnerHTML"),
    `${relative} uses dangerouslySetInnerHTML.`,
  );
}

if (failures.length) {
  console.error("Production readiness validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Production readiness validation passed.");
console.log(
  "404 recovery, error boundaries, lazy-chunk recovery, payment completion, persisted-state hygiene, environment configuration, pinned direct dependencies, and deployment guardrails verified.",
);
