const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "src");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const reactFiles = walk(sourceRoot).filter((file) => /\.jsx?$/.test(file));
const source = reactFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const home = fs.readFileSync(path.join(sourceRoot, "pages/home/Home.jsx"), "utf8");
const homeMediaSource = fs.readFileSync(path.join(sourceRoot, "pages/home/homeMedia.js"), "utf8");
const footer = fs.readFileSync(path.join(sourceRoot, "components/footer/Footer.jsx"), "utf8");
const footerStyles = fs.readFileSync(path.join(sourceRoot, "components/footer/footer.scss"), "utf8");
const authPage = fs.readFileSync(path.join(sourceRoot, "pages/signinandsignup/SignInAndSignUp.jsx"), "utf8");
const shopSaga = fs.readFileSync(path.join(sourceRoot, "redux/shop/sagas.js"), "utf8");
const shopDataSource = fs.readFileSync(path.join(sourceRoot, "redux/shop/shopData.js"), "utf8");
const directorySource = fs.readFileSync(path.join(sourceRoot, "redux/directory/directoryReducer.js"), "utf8");

assert(!/\bconnect\s*\(/.test(source), "Legacy react-redux connect() usage remains.");
assert(!/mapStateToProps|mapDispatchToProps/.test(source), "Legacy Redux mapping boilerplate remains.");
assert(!/import\s+React(?:\s*,|\s+from)/.test(source), "Unnecessary default React imports remain under the automatic JSX runtime.");
assert(home.includes("home-visual-journal"), "Homepage image-rich visual journal is missing.");
assert(homeMediaSource.includes("usedImages") && homeMediaSource.includes("reservedImageUrls"), "Homepage does not guard against repeated images.");
assert(footer.includes("site-footer__bar") && footerStyles.includes("min-height: 5.75rem"), "Compact footer implementation is missing.");
assert(authPage.includes("<Tabs") && authPage.includes("auth-story"), "Redesigned tabbed sign-in experience is missing.");
assert(shopSaga.includes("mergeCatalogWithFallback"), "Shop saga does not use the local catalog fallback.");

const shopContext = {};
vm.createContext(shopContext);
vm.runInContext(
  shopDataSource.replace("export default SHOP_DATA;", "globalThis.SHOP_DATA = SHOP_DATA;"),
  shopContext
);
const shopData = shopContext.SHOP_DATA;
for (const key of ["mens", "womens", "jackets", "sneakers", "hats"]) {
  assert(Array.isArray(shopData?.[key]?.items) && shopData[key].items.length > 0, `${key} does not have fallback products.`);
}

const mediaContext = {};
vm.createContext(mediaContext);
vm.runInContext(
  `${homeMediaSource
    .replace(/export const /g, "const ")}
   globalThis.buildHomepageMedia = buildHomepageMedia;
   globalThis.getHomepageImageUrls = getHomepageImageUrls;`,
  mediaContext
);
const directoryImages = [...directorySource.matchAll(/imageUrl:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const media = mediaContext.buildHomepageMedia(shopData, directoryImages);
const homepageUrls = mediaContext.getHomepageImageUrls(media);
const allHomepageImages = [...directoryImages, ...homepageUrls];
assert(homepageUrls.length >= 12, "Homepage does not select enough unique product imagery.");
assert(new Set(allHomepageImages).size === allHomepageImages.length, "Homepage repeats an image across category and merchandising regions.");

if (failures.length) {
  console.error("Frontend refresh validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Frontend refresh validation passed.");
console.log(`Homepage renders ${allHomepageImages.length} unique images across category and merchandising regions.`);
console.log("Redux hooks, compact footer, redesigned auth, and populated catalog fallback verified.");
