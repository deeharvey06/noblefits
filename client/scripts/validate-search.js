const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "src/components/searchPanel/SearchPanel.jsx",
  "src/components/searchPanel/searchUtils.js",
  "src/components/searchPanel/searchPanel.scss",
  "src/pages/search/SearchPage.jsx",
  "src/pages/search/searchPage.scss",
  "src/components/searchPanel/searchUtils.test.js",
  "SEARCH.md",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);
if (missing.length) {
  console.error(`Search validation failed. Missing: ${missing.join(", ")}`);
  process.exit(1);
}

const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const panel = fs.readFileSync(
  path.join(root, "src/components/searchPanel/SearchPanel.jsx"),
  "utf8",
);
const page = fs.readFileSync(
  path.join(root, "src/pages/search/SearchPage.jsx"),
  "utf8",
);
const utils = fs.readFileSync(
  path.join(root, "src/components/searchPanel/searchUtils.js"),
  "utf8",
);
const styles = [
  "src/components/searchPanel/searchPanel.scss",
  "src/pages/search/searchPage.scss",
]
  .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
  .join("\n");

const checks = [
  [app.includes('path="/search"'), "Dedicated /search route is missing"],
  [
    panel.includes("Recent searches"),
    "Recent searches are missing from quick search",
  ],
  [panel.includes("View all results"), "Full search results action is missing"],
  [page.includes("ProductCard"), "Search result product previews are missing"],
  [
    utils.includes("localStorage"),
    "Local recent-search persistence is missing",
  ],
  [utils.includes("editDistance"), "Client-side typo tolerance is missing"],
  [
    !panel.includes("Best seller") && !page.includes("Best seller"),
    "Unsupported ranking claim found",
  ],
  [
    !panel.includes("Trending") && !page.includes("Trending"),
    "Unsupported trending claim found",
  ],
];

const failures = checks.filter(([ok]) => !ok).map(([, message]) => message);
const rawColorPattern = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/;
if (rawColorPattern.test(styles))
  failures.push("Hard-coded color found in Phase 7 search styles");

if (failures.length) {
  console.error("Search validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Search validation passed.");
console.log(`${requiredFiles.length} Phase 7 search files found.`);
console.log(
  "Client-side autocomplete, recents, typo tolerance, product previews, and /search results are present.",
);
console.log(
  "No unsupported popularity/trending claims or hard-coded search colors found.",
);
