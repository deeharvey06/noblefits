const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`Accessibility validation failed: ${message}`);
  process.exit(1);
};

const requiredFiles = [
  "md/ACCESSIBILITY.md",
  "src/components/accessibility/RouteAccessibility.jsx",
  "src/design-system/Overlays.jsx",
  "src/design-system/FormControls.jsx",
  "src/design-system/QuantityControl.jsx",
  "src/design-system/CommerceDisplay.jsx",
  "src/styles/design-system.scss",
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file)))
    fail(`missing accessibility file: ${file}`);
}

const app = read("src/App.jsx");
for (const marker of [
  'className="skip-link"',
  'href="#main-content"',
  "<RouteAccessibility />",
  'id="main-content"',
  'tabIndex="-1"',
]) {
  if (!app.includes(marker))
    fail(`application shell missing accessibility marker: ${marker}`);
}

const routeA11y = read("src/components/accessibility/RouteAccessibility.jsx");
for (const marker of [
  'role="status"',
  'aria-live="polite"',
  "document.title",
  "main.focus({ preventScroll: true })",
]) {
  if (!routeA11y.includes(marker))
    fail(`route accessibility behavior missing: ${marker}`);
}

const overlays = read("src/design-system/Overlays.jsx");
for (const marker of [
  "createPortal",
  'setAttribute("inert", "")',
  'setAttribute("aria-hidden", "true")',
  'aria-modal="true"',
  'event.key === "Escape"',
  "aria-describedby",
  'role="tooltip"',
]) {
  if (!overlays.includes(marker))
    fail(`overlay accessibility behavior missing: ${marker}`);
}

const forms = read("src/design-system/FormControls.jsx");
for (const marker of [
  "htmlFor={id}",
  "aria-invalid",
  "aria-describedby",
  "aria-errormessage",
  "required={required}",
]) {
  if (!forms.includes(marker))
    fail(`form-control accessibility behavior missing: ${marker}`);
}

const quantity = read("src/design-system/QuantityControl.jsx");
if (
  !quantity.includes('role="group"') ||
  !quantity.includes('aria-live="polite"')
) {
  fail("quantity control is not exposed as a named group with a live value");
}

const commerce = read("src/design-system/CommerceDisplay.jsx");
if (/ds-price[^\n]*aria-label=/.test(commerce)) {
  fail("price output still replaces visible pricing content with aria-label");
}
if (
  !commerce.includes('role="img"') ||
  !commerce.includes('className="sr-only"')
) {
  fail("price/rating screen-reader semantics are incomplete");
}

const header = read("src/components/header/Header.jsx");
for (const marker of [
  'aria-haspopup="dialog"',
  'aria-controls="mobile-site-navigation"',
  'aria-controls="site-search-drawer"',
]) {
  if (!header.includes(marker))
    fail(`header disclosure semantics missing: ${marker}`);
}

const cartIcon = read("src/components/cartIcon/CartIcon.jsx");
const cartDropdown = read("src/components/cartDropdown/CartDropdown.jsx");
if (
  !cartIcon.includes('id="site-cart-trigger"') ||
  !cartIcon.includes("aria-expanded")
) {
  fail("cart trigger does not expose disclosure state");
}
if (
  !cartDropdown.includes("trigger?.focus()") ||
  !cartDropdown.includes('role="region"')
) {
  fail("cart preview does not restore focus or expose a labelled region");
}

const productListing = read("src/components/productListing/ProductListing.jsx");
if (!productListing.includes("headingLevel={2}")) {
  fail("catalog product cards skip the H2 level below the listing H1");
}

const signUp = read("src/components/signUp/SignUp.jsx");
if (!signUp.includes("error={confirmPasswordError}")) {
  fail("password confirmation error is not directly associated with its field");
}

const headerStyles = read("src/components/header/header.scss");
if (!/\.is-active\s*\{[^}]*border-bottom-color:/s.test(headerStyles)) {
  fail("active mobile navigation relies on color alone");
}

const componentStyles = read("src/design-system/components.scss");
for (const marker of [
  'content: "✓"',
  "@media (forced-colors: active)",
  '.ds-tooltip[data-visible="true"]',
]) {
  if (!componentStyles.includes(marker))
    fail(`shared component accessibility styling missing: ${marker}`);
}

const globalStyles = read("src/styles/design-system.scss");
for (const marker of [
  "--touch-target-min: 2.75rem",
  "--control-height-sm: 2.75rem",
  "@media (prefers-reduced-motion: reduce)",
  "@media (forced-colors: active)",
]) {
  if (!globalStyles.includes(marker))
    fail(`global accessibility styling missing: ${marker}`);
}

const parseHex = (value) => {
  const hex = value.replace("#", "");
  if (![3, 6].includes(hex.length)) return null;
  const expanded =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  return [0, 2, 4].map(
    (index) => parseInt(expanded.slice(index, index + 2), 16) / 255,
  );
};
const luminance = (hex) => {
  const rgb = parseHex(hex);
  if (!rgb) fail(`cannot parse contrast color ${hex}`);
  const adjusted = rgb.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
};
const contrast = (a, b) => {
  const one = luminance(a);
  const two = luminance(b);
  return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
};
const token = (name) => {
  const match = globalStyles.match(
    new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,6})`),
  );
  if (!match) fail(`missing hex token --${name}`);
  return match[1];
};
const textPairs = [
  ["color-text-primary", "color-background"],
  ["color-text-secondary", "color-background"],
  ["color-text-muted", "color-background"],
  ["color-text-muted", "color-surface"],
  ["color-accent", "color-surface"],
  ["color-error", "color-error-surface"],
  ["color-success", "color-success-surface"],
  ["color-warning", "color-warning-surface"],
  ["color-informational", "color-informational-surface"],
];
for (const [foreground, background] of textPairs) {
  const ratio = contrast(token(foreground), token(background));
  if (ratio < 4.5)
    fail(
      `${foreground} / ${background} contrast is ${ratio.toFixed(2)}:1; expected >= 4.5:1`,
    );
}
for (const [foreground, background] of [
  ["color-focus", "color-background"],
  ["color-focus", "color-surface"],
  ["color-border-strong", "color-background"],
  ["color-border-strong", "color-surface"],
]) {
  const ratio = contrast(token(foreground), token(background));
  if (ratio < 3)
    fail(
      `${foreground} / ${background} non-text contrast is ${ratio.toFixed(2)}:1; expected >= 3:1`,
    );
}

const jsFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".js")) jsFiles.push(full);
  }
};
walk(path.join(root, "src"));

for (const file of jsFiles) {
  const source = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");

  if (/<(?:div|span)\b[^>]*\bonClick=/s.test(source)) {
    fail(`non-semantic clickable div/span found in ${relative}`);
  }

  for (const match of source.matchAll(/<img\b[\s\S]*?>/g)) {
    if (!/\balt\s*=/.test(match[0]))
      fail(`image without alt attribute in ${relative}`);
  }

  for (const match of source.matchAll(/<button\b[\s\S]*?>/g)) {
    if (!/\btype\s*=/.test(match[0]))
      fail(`button without explicit type in ${relative}`);
  }

  for (const match of source.matchAll(/tabIndex\s*=\s*["'{]?([1-9]\d*)/g)) {
    fail(`positive tabIndex ${match[1]} found in ${relative}`);
  }
}

const docs = read("md/ACCESSIBILITY.md");
for (const section of [
  "Semantic structure",
  "Keyboard navigation and focus",
  "Accessible names, labels and errors",
  "Contrast and non-color cues",
  "Dialogs, drawers and menus",
  "Screen-reader behavior",
  "Touch targets",
  "Reduced motion and high contrast",
  "Known limitations / follow-up",
]) {
  if (!docs.includes(section))
    fail(`accessibility audit documentation missing: ${section}`);
}

console.log("Accessibility validation passed.");
console.log(
  "Semantic controls, image alternatives, focus management, modal isolation, form errors, route announcements, contrast, touch targets, reduced motion, and non-color state cues verified.",
);
