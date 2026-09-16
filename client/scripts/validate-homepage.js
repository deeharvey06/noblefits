const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const home = fs.readFileSync(path.join(root, "src/pages/home/Home.jsx"), "utf8");
const homeStyles = fs.readFileSync(path.join(root, "src/pages/home/home.scss"), "utf8");
const menu = fs.readFileSync(path.join(root, "src/components/menuItem/MenuItem.jsx"), "utf8");

const requiredCopy = [
  "Build your everyday rotation.",
  "Shop by category",
  "The Noble Edit.",
  "Outerwear, up close.",
  "Keep exploring.",
];

const forbiddenClaims = [
  /best seller/i,
  /new arrival/i,
  /five[- ]star/i,
  /free shipping/i,
  /limited time/i,
  /customer review/i,
];

const missing = requiredCopy.filter((text) => !home.includes(text));
const fabricated = forbiddenClaims.filter((pattern) => pattern.test(home));
const hardCodedHex = /#[0-9a-f]{3,8}\b/i.test(homeStyles);
const hasSemanticImage = menu.includes("<img") || menu.includes("<ResilientImage");

if (missing.length || fabricated.length || hardCodedHex || !hasSemanticImage) {
  console.error("Homepage validation failed.");
  if (missing.length) console.error("Missing homepage sections:", missing.join(", "));
  if (fabricated.length) console.error("Unsupported marketing claims detected.");
  if (hardCodedHex) console.error("Hard-coded color detected in homepage styles.");
  if (!hasSemanticImage) console.error("Category tiles must use semantic images.");
  process.exit(1);
}

console.log("Homepage validation passed.");
console.log("5 purposeful merchandising sections found.");
console.log("No unsupported bestseller/new-arrival/social-proof/shipping claims found.");
console.log("Homepage styles use semantic design tokens.");
