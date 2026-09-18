const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "src");

const requiredFiles = [
  "components/header/Header.jsx",
  "components/footer/Footer.jsx",
  "components/searchPanel/SearchPanel.jsx",
  "components/breadcrumbTrail/BreadcrumbTrail.jsx",
  "components/appShell/appShell.scss",
  "components/cartIcon/CartIcon.jsx",
  "components/cartDropdown/CartDropdown.jsx",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(sourceRoot, file)),
);

const header = fs.readFileSync(
  path.join(sourceRoot, "components/header/Header.jsx"),
  "utf8",
);
const app = fs.readFileSync(path.join(sourceRoot, "App.jsx"), "utf8");
const search = fs.readFileSync(
  path.join(sourceRoot, "components/searchPanel/SearchPanel.jsx"),
  "utf8",
);
const cartIcon = fs.readFileSync(
  path.join(sourceRoot, "components/cartIcon/CartIcon.jsx"),
  "utf8",
);

const shellStyles = [
  "components/header/header.scss",
  "components/footer/footer.scss",
  "components/searchPanel/searchPanel.scss",
  "components/breadcrumbTrail/breadcrumbTrail.scss",
  "components/appShell/appShell.scss",
  "components/cartIcon/cartIcon.scss",
  "components/cartDropdown/cartDropdown.scss",
  "components/cartItem/cartItem.scss",
]
  .map((file) => fs.readFileSync(path.join(sourceRoot, file), "utf8"))
  .join("\n");

const failures = [];

if (missingFiles.length)
  failures.push(`Missing files: ${missingFiles.join(", ")}`);
if (header.includes("/contact"))
  failures.push("Dead /contact navigation is still present.");
if (!header.includes('aria-label="Primary navigation"')) {
  failures.push("Primary navigation is missing its accessible label.");
}
if (!header.includes("SearchPanel"))
  failures.push("Search is not exposed in the global header.");
if (!search.includes("fetchCollectionsStart")) {
  failures.push("Search does not reuse the existing collection-fetch flow.");
}
if (!cartIcon.includes("<button"))
  failures.push("Cart trigger is not a semantic button.");
if (!cartIcon.includes("aria-expanded"))
  failures.push("Cart trigger does not expose expanded state.");
if (!app.includes('id="main-content"'))
  failures.push("App shell is missing the main-content target.");
if (!app.includes("<Footer"))
  failures.push("App shell is missing the global footer.");

const rawColorPattern = /#[0-9a-fA-F]{3,8}|rgba?\s*\(/g;
const rawColors = shellStyles.match(rawColorPattern) || [];
if (rawColors.length)
  failures.push(`Hard-coded shell colors found: ${rawColors.join(", ")}`);

if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}

console.log("Global shell validation passed.");
console.log(`${requiredFiles.length} required shell modules found.`);
console.log(
  "Dead Contact navigation removed; search and cart are exposed globally.",
);
console.log("No hard-coded colors found in Phase 4 shell styles.");
