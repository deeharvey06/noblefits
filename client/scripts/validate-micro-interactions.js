const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`Micro-interactions validation failed: ${message}`);
  process.exit(1);
};

const requiredFiles = [
  "MICRO_INTERACTIONS.md",
  "src/styles/design-system.scss",
  "src/design-system/components.scss",
  "src/design-system/Overlays.jsx",
  "src/design-system/ProductCard.jsx",
  "src/components/cartIcon/CartIcon.jsx",
  "src/components/cartIcon/cartIcon.scss",
  "src/components/cartDropdown/cartDropdown.scss",
  "src/components/productListing/ProductListing.jsx",
  "src/components/productListing/productListing.scss",
  "src/pages/search/SearchPage.jsx",
  "src/pages/search/searchPage.scss",
  "src/pages/productDetail/ProductDetailPage.jsx",
  "src/pages/productDetail/productDetailPage.scss",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file)))
    fail(`missing Phase 14 file: ${file}`);
}

const globalStyles = read("src/styles/design-system.scss");
for (const marker of [
  "--duration-fast: 120ms",
  "--duration-standard: 180ms",
  "--duration-slow: 220ms",
  "--motion-distance-xs: 0.25rem",
  "--motion-distance-sm: 0.5rem",
  "@media (prefers-reduced-motion: reduce)",
]) {
  if (!globalStyles.includes(marker))
    fail(`missing motion-system marker: ${marker}`);
}

const overlays = read("src/design-system/Overlays.jsx");
for (const marker of [
  "useOverlayPresence",
  "overlayExitDuration = 220",
  'matchMedia?.("(prefers-reduced-motion: reduce)")',
  "data-state={state}",
  "useModalBehavior(present",
]) {
  if (!overlays.includes(marker))
    fail(`overlay motion behavior missing: ${marker}`);
}

const components = read("src/design-system/components.scss");
for (const marker of [
  '.ds-button[data-success="true"]',
  '.ds-overlay[data-state="open"]',
  '.ds-overlay[data-state="closed"]',
  '.ds-drawer[data-state="open"]',
  "animation: ds-feedback-in var(--duration-standard)",
  "@keyframes ds-feedback-pop",
]) {
  if (!components.includes(marker))
    fail(`shared micro-interaction missing: ${marker}`);
}

const productCard = read("src/design-system/ProductCard.jsx");
if (
  !productCard.includes('added ? "Added to bag" : actionLabel') ||
  !productCard.includes("data-success={added")
) {
  fail("product-card Add to Bag success feedback is missing");
}

const cartIcon = read("src/components/cartIcon/CartIcon.jsx");
const cartIconStyles = read("src/components/cartIcon/cartIcon.scss");
if (
  !cartIcon.includes("key={itemCount}") ||
  !cartIconStyles.includes("cart-count-feedback")
) {
  fail("cart-count change feedback is missing");
}

const cartDropdownStyles = read(
  "src/components/cartDropdown/cartDropdown.scss",
);
if (
  !cartDropdownStyles.includes("cart-dropdown-enter") ||
  !cartDropdownStyles.includes("var(--duration-standard)")
) {
  fail("mini-cart entrance feedback is missing");
}

const listing = read("src/components/productListing/ProductListing.jsx");
const listingStyles = read("src/components/productListing/productListing.scss");
if (
  !listing.includes("resultMotionKey") ||
  !listingStyles.includes("catalog-results-refresh")
) {
  fail("catalog filter/sort result refresh motion is missing");
}

const search = read("src/pages/search/SearchPage.jsx");
const searchStyles = read("src/pages/search/searchPage.scss");
if (
  !search.includes("search-page__results--updated") ||
  !searchStyles.includes("search-results-refresh")
) {
  fail("submitted search-result feedback is missing");
}

const pdp = read("src/pages/productDetail/ProductDetailPage.jsx");
const pdpStyles = read("src/pages/productDetail/productDetailPage.scss");
if (
  !pdp.includes("key={activeImage.src}") ||
  !pdpStyles.includes("product-gallery-image-enter")
) {
  fail("PDP image transition is missing");
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

for (const file of scssFiles) {
  const source = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const transitionMs = [
    ...source.matchAll(/transition(?:-duration)?:[^;]*?(\d+)ms/g),
  ].map((match) => Number(match[1]));
  for (const duration of transitionMs) {
    if (duration > 220)
      fail(
        `interaction transition longer than 220ms (${duration}ms) in ${relative}`,
      );
  }
}

const docs = read("MICRO_INTERACTIONS.md");
for (const section of [
  "Motion principles",
  "Button feedback",
  "Cart updates",
  "Drawers and dialogs",
  "Navigation",
  "Product imagery",
  "Filters and search",
  "Loading states",
  "Success feedback",
  "Reduced motion",
  "Intentionally not animated",
]) {
  if (!docs.includes(section))
    fail(`Phase 14 documentation missing: ${section}`);
}

console.log("Micro-interactions validation passed.");
console.log(
  "120–220ms interaction timing, restrained state feedback, overlay presence, cart/product/search feedback, and reduced-motion behavior verified.",
);
