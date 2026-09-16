const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const tokenFile = path.join(root, "src/styles/design-system.scss");
const componentStyle = path.join(root, "src/design-system/components.scss");
const tokenSource = fs.readFileSync(tokenFile, "utf8");
const componentSource = fs.readFileSync(componentStyle, "utf8");

const requiredTokens = [
  "--color-background",
  "--color-surface",
  "--color-surface-elevated",
  "--color-border",
  "--color-divider",
  "--color-text-primary",
  "--color-text-secondary",
  "--color-text-muted",
  "--color-brand",
  "--color-accent",
  "--color-success",
  "--color-warning",
  "--color-error",
  "--color-informational",
  "--color-focus",
  "--color-disabled",
  "--color-sale",
  "--color-price",
  "--color-discount",
  "--type-display-size",
  "--type-h1-size",
  "--type-h2-size",
  "--type-h3-size",
  "--type-h4-size",
  "--type-body-lg-size",
  "--type-body-size",
  "--type-body-sm-size",
  "--type-label-size",
  "--type-caption-size",
  "--type-price-size",
  "--type-product-title-size",
  "--type-button-size",
  "--type-navigation-size",
  "--layout-content-max",
  "--layout-gutter-mobile",
  "--layout-gutter-tablet",
  "--layout-gutter-desktop",
  "--layout-grid-gap",
  "--layout-grid-card-min",
];

const missing = requiredTokens.filter((token) => !tokenSource.includes(`${token}:`));

const rawColorPattern = /#[0-9a-fA-F]{3,8}|rgba?\s*\(/g;
const componentRawColors = componentSource.match(rawColorPattern) || [];

const componentFiles = [
  "Button.jsx",
  "IconButton.jsx",
  "Link.jsx",
  "FormControls.jsx",
  "QuantityControl.jsx",
  "SearchField.jsx",
  "CommerceDisplay.jsx",
  "ProductCard.jsx",
  "Navigation.jsx",
  "Overlays.jsx",
  "Feedback.jsx",
  "index.js",
];

const missingFiles = componentFiles.filter(
  (file) => !fs.existsSync(path.join(root, "src/design-system", file))
);

if (missing.length || componentRawColors.length || missingFiles.length) {
  if (missing.length) console.error("Missing semantic tokens:", missing.join(", "));
  if (componentRawColors.length) {
    console.error("Hard-coded colors found in component styles:", componentRawColors.join(", "));
  }
  if (missingFiles.length) console.error("Missing component files:", missingFiles.join(", "));
  process.exit(1);
}

console.log(`Design system validation passed: ${requiredTokens.length} required tokens found.`);
console.log(`${componentFiles.length} component modules found.`);
console.log("No hard-coded colors found in design-system component styles.");
