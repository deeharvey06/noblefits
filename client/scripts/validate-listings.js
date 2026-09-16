const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const listingPath = path.join(root, "src/components/productListing/ProductListing.jsx");
const listingStylePath = path.join(root, "src/components/productListing/productListing.scss");
const overviewPath = path.join(root, "src/components/collectionsOverview/CollectionsOverview.jsx");
const collectionPath = path.join(root, "src/pages/collection/Collection.jsx");
const packagePath = path.join(root, "package.json");

const requiredFiles = [
  listingPath,
  listingStylePath,
  overviewPath,
  collectionPath,
  path.join(root, "src/components/productListing/ProductListing.test.js"),
];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

const listing = fs.existsSync(listingPath) ? fs.readFileSync(listingPath, "utf8") : "";
const styles = fs.existsSync(listingStylePath) ? fs.readFileSync(listingStylePath, "utf8") : "";
const overview = fs.existsSync(overviewPath) ? fs.readFileSync(overviewPath, "utf8") : "";
const collection = fs.existsSync(collectionPath) ? fs.readFileSync(collectionPath, "utf8") : "";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const requiredPatterns = [
  ["collection filtering", /selectedCollections/],
  ["price filtering", /PRICE_FILTERS/],
  ["sorting", /price-asc/],
  ["result count", /resultLabel/],
  ["mobile filter drawer", /<Drawer/],
  ["catalog product cards", /<ProductCard/],
  ["real sale-price support", /compareAtPrice=\{product\.compareAtPrice\}/],
  ["real rating support", /product\.rating/],
  ["real availability support", /product\.inStock/],
];

const failures = [];
if (missingFiles.length) failures.push(`Missing Phase 6 files: ${missingFiles.join(", ")}`);
for (const [label, pattern] of requiredPatterns) {
  if (!pattern.test(listing)) failures.push(`Missing ${label}.`);
}

if (!overview.includes("ProductListing") || !collection.includes("ProductListing")) {
  failures.push("Shop overview and collection page are not sharing the reusable listing system.");
}

const forbiddenClaims = [
  /best seller/i,
  /new arrival/i,
  /in stock[^\n]*true/i,
  /five[- ]star/i,
  /sale[^\n]*%/i,
];
for (const pattern of forbiddenClaims) {
  if (pattern.test(listing) || pattern.test(overview) || pattern.test(collection)) {
    failures.push(`Unsupported merchandising claim detected: ${pattern}`);
  }
}

const rawColors = /#[0-9a-f]{3,8}\b|rgba?\s*\(/i;
if (rawColors.test(styles)) failures.push("Hard-coded color detected in Phase 6 listing styles.");

if (!/grid-template-columns:\s*repeat\(4/.test(styles)) {
  failures.push("Desktop product-grid hierarchy is missing.");
}
if (!/@include tablet-down/.test(styles) || !/@include mobile-down/.test(styles)) {
  failures.push("Responsive tablet/mobile listing rules are missing.");
}

if (!String(packageJson.scripts?.validate || "").includes("listings:validate")) {
  failures.push("Phase 6 validator is not included in npm run validate.");
}

if (failures.length) {
  console.error("Product listing validation failed.");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Product listing validation passed.");
console.log("Shared shop/collection listing system found.");
console.log("Collection + price filters, sorting, result counts, and mobile filter drawer found.");
console.log("Optional sale/rating/availability UI is data-driven only.");
console.log("Phase 6 styles use semantic design tokens.");
