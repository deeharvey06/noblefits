const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "src/pages/productDetail/ProductDetailPage.jsx",
  "src/pages/productDetail/productDetailPage.scss",
  "src/utils/productRoutes.js",
  "src/utils/productRoutes.test.js",
  "PRODUCT_DETAIL.md",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);
const page = fs.existsSync(path.join(root, requiredFiles[0]))
  ? fs.readFileSync(path.join(root, requiredFiles[0]), "utf8")
  : "";
const styles = fs.existsSync(path.join(root, requiredFiles[1]))
  ? fs.readFileSync(path.join(root, requiredFiles[1]), "utf8")
  : "";
const shopPage = fs.readFileSync(
  path.join(root, "src/pages/shop/ShopPage.jsx"),
  "utf8",
);
const productCard = fs.readFileSync(
  path.join(root, "src/design-system/ProductCard.jsx"),
  "utf8",
);
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

const checks = [
  [
    shopPage.includes('path=":collectionId/:productId"'),
    "Product detail route is missing",
  ],
  [page.includes("product-gallery"), "Product gallery is missing"],
  [page.includes("QuantityControl"), "Quantity control is missing"],
  [page.includes("Add to bag"), "Primary Add to Bag action is missing"],
  [
    page.includes("product-mobile-purchase"),
    "Mobile sticky purchase action is missing",
  ],
  [
    page.includes("getRelatedProducts"),
    "Same-collection related products are missing",
  ],
  [
    page.includes("compareAtPrice={product.compareAtPrice}"),
    "Data-driven sale-price support is missing",
  ],
  [
    page.includes('typeof product.rating === "number"'),
    "Data-driven rating support is missing",
  ],
  [
    page.includes("product.description &&"),
    "Data-driven description support is missing",
  ],
  [
    page.includes("product.shippingInfo &&"),
    "Data-driven shipping support is missing",
  ],
  [
    page.includes("product.returnsInfo &&"),
    "Data-driven returns support is missing",
  ],
  [
    productCard.includes("productHref"),
    "Product cards do not expose PDP links",
  ],
  [
    String(packageJson.scripts?.validate || "").includes(
      "product-detail:validate",
    ),
    "PDP validator is not included in npm run validate",
  ],
];

const failures = [];
if (missing.length)
  failures.push(`Missing Phase 8 files: ${missing.join(", ")}`);
for (const [ok, message] of checks) if (!ok) failures.push(message);

const forbiddenClaims = [
  /free shipping/i,
  /free returns/i,
  /30[- ]day return/i,
  /best seller/i,
  /limited time/i,
  /only \d+ left/i,
  /five[- ]star/i,
  /buy now/i,
];
for (const pattern of forbiddenClaims) {
  if (pattern.test(page))
    failures.push(`Unsupported PDP claim/capability detected: ${pattern}`);
}

const rawColors = /#[0-9a-f]{3,8}\b|rgba?\s*\(/i;
if (rawColors.test(styles))
  failures.push("Hard-coded color detected in Phase 8 PDP styles");

if (!/@include tablet-down/.test(styles) || !/position:\s*fixed/.test(styles)) {
  failures.push(
    "Intentional tablet/mobile sticky purchase behavior is missing",
  );
}

if (failures.length) {
  console.error("Product detail validation failed.");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Product detail validation passed.");
console.log(`${requiredFiles.length} Phase 8 product-detail files found.`);
console.log(
  "Gallery, quantity, Add to Bag, related products, product links, and mobile sticky purchase are present.",
);
console.log(
  "Optional commerce information is data-driven and no unsupported PDP claims were found.",
);
