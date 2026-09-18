const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`Responsive validation failed: ${message}`);
  process.exit(1);
};

const requiredFiles = [
  "RESPONSIVE.md",
  "src/styles/_tokens.scss",
  "src/styles/design-system.scss",
  "src/design-system/components.scss",
  "src/components/appShell/appShell.scss",
  "src/components/header/header.scss",
  "src/components/footer/footer.scss",
  "src/pages/home/home.scss",
  "src/components/productListing/productListing.scss",
  "src/pages/search/searchPage.scss",
  "src/components/searchPanel/searchPanel.scss",
  "src/pages/productDetail/productDetailPage.scss",
  "src/pages/checkout/checkout.scss",
  "src/components/checkoutItem/checkoutItem.scss",
  "src/components/stripeButton/stripeButton.scss",
  "src/pages/signinandsignup/signinandsignup.scss",
  "src/pages/forgotPassword/forgotPasswordPage.scss",
  "src/pages/account/accountPage.scss",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file)))
    fail(`missing responsive audit file: ${file}`);
}

const indexHtml = read("index.html");
if (!indexHtml.includes("viewport-fit=cover"))
  fail("viewport metadata does not opt into safe-area-aware layouts");

const tokens = read("src/styles/_tokens.scss");
for (const marker of [
  "$breakpoint-mobile: 480px",
  "$breakpoint-tablet: 800px",
  "$breakpoint-laptop: 1024px",
  "$breakpoint-desktop: 1280px",
]) {
  if (!tokens.includes(marker))
    fail(`missing breakpoint definition: ${marker}`);
}

const globalStyles = read("src/styles/design-system.scss");
if (
  /body\s*\{[^}]*padding-inline:/s.test(globalStyles) ||
  /body\s*\{[^}]*padding:\s*var\(--space/s.test(globalStyles)
) {
  fail("body still owns responsive page gutters; shell should own gutters");
}
if (!globalStyles.includes("min-width: 320px"))
  fail("320px minimum viewport support is not explicit");

const appShell = read("src/components/appShell/appShell.scss");
for (const marker of ["desktop-up", "tablet-down", "mobile-down"]) {
  if (!appShell.includes(marker))
    fail(`app shell missing ${marker} layout behavior`);
}

const header = read("src/components/header/header.scss");
for (const marker of ["laptop-down", "tablet-down", "mobile-down"]) {
  if (!header.includes(marker)) fail(`header missing ${marker} behavior`);
}
if (!header.includes("env(safe-area-inset-left)"))
  fail("mobile header does not account for safe areas");

const componentStyles = read("src/design-system/components.scss");
if (
  !componentStyles.includes(".ds-product-card .ds-button") ||
  !componentStyles.includes("min-width: 0")
) {
  fail(
    "product-card actions can still force narrow grids wider than the viewport",
  );
}
if (!componentStyles.includes("90dvh") || !componentStyles.includes("100dvh")) {
  fail("dialogs/drawers do not use dynamic viewport sizing");
}

const pageExpectations = [
  ["src/pages/home/home.scss", ["laptop-down", "tablet-down", "mobile-down"]],
  [
    "src/components/productListing/productListing.scss",
    ["laptop-down", "tablet-down", "mobile-down"],
  ],
  [
    "src/pages/search/searchPage.scss",
    ["laptop-down", "tablet-down", "mobile-down"],
  ],
  [
    "src/pages/productDetail/productDetailPage.scss",
    ["laptop-down", "tablet-down", "mobile-down"],
  ],
  [
    "src/pages/checkout/checkout.scss",
    ["laptop-down", "tablet-down", "mobile-down"],
  ],
  [
    "src/pages/signinandsignup/signinandsignup.scss",
    ["laptop-down", "tablet-down", "mobile-down"],
  ],
  [
    "src/pages/account/accountPage.scss",
    ["laptop-down", "tablet-down", "mobile-down"],
  ],
];

for (const [file, markers] of pageExpectations) {
  const source = read(file);
  for (const marker of markers) {
    if (!source.includes(marker))
      fail(`${file} missing ${marker} responsive treatment`);
  }
}

const pdp = read("src/pages/productDetail/productDetailPage.scss");
if (!pdp.includes("env(safe-area-inset-bottom)"))
  fail("mobile PDP purchase action lacks bottom safe-area handling");

const cartDropdown = read("src/components/cartDropdown/cartDropdown.scss");
if (
  !cartDropdown.includes("100dvh") ||
  !cartDropdown.includes("safe-area-inset")
) {
  fail("mobile cart overlay is not viewport/safe-area aware");
}

const checkout = read("src/pages/checkout/checkout.scss");
if (!checkout.includes("top: calc(var(--space-24) + var(--space-8))")) {
  fail(
    "desktop checkout summary sticky offset does not account for the sticky header",
  );
}

const touchTokenSource = read("src/styles/design-system.scss");
if (!touchTokenSource.includes("--touch-target-min: 2.75rem")) {
  fail("44px touch target baseline changed or is missing");
}

const scssFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".scss"))
      scssFiles.push(full);
  }
};
walk(path.join(root, "src"));

const horizontalScrollFiles = scssFiles
  .filter((file) => /overflow-x:\s*auto/.test(fs.readFileSync(file, "utf8")))
  .map((file) => path.relative(root, file).replace(/\\/g, "/"));
const allowedHorizontalScroll = new Set([
  "src/components/productListing/productListing.scss",
  "src/design-system/components.scss",
]);
for (const file of horizontalScrollFiles) {
  if (!allowedHorizontalScroll.has(file)) {
    fail(`unexpected horizontal-scrolling layout found in ${file}`);
  }
}

const docs = read("RESPONSIVE.md");
for (const section of [
  "Large desktop",
  "Laptop",
  "Tablet",
  "Mobile",
  "Homepage",
  "Shop / collections",
  "Search",
  "Product detail",
  "Cart / checkout",
  "Sign in / registration",
  "Account",
  "Intentional horizontal scrolling",
]) {
  if (!docs.includes(section))
    fail(`responsive audit documentation missing: ${section}`);
}

console.log("Responsive validation passed.");
console.log(
  "Large desktop, laptop, tablet, and 320px+ mobile behaviors are documented and guarded.",
);
console.log(
  "Global gutters, product-card actions, overlays, sticky commerce UI, touch targets, and horizontal overflow policy verified.",
);
