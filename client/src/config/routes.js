const segment = (value) => encodeURIComponent(String(value));

export const ROUTES = Object.freeze({
  home: "/",
  shop: "/shop",
  shopRoot: "/shop/*",
  checkout: "/checkout",
  search: "/search",
  account: "/account",
  signIn: "/signin",
  forgotPassword: "/forgot-password",
  collectionPattern: ":collectionId",
  productPattern: ":collectionId/:productId",
  notFound: "*",
});

export const collectionPath = (collection) =>
  `${ROUTES.shop}/${segment(collection)}`;
export const productPath = (collection, product) =>
  `${collectionPath(collection)}/${segment(product)}`;
export const searchPath = (query = "") =>
  query.trim()
    ? `${ROUTES.search}?${new URLSearchParams({ q: query.trim() })}`
    : ROUTES.search;

export const CATEGORY_LINKS = [
  ["Men", collectionPath("mens")],
  ["Women", collectionPath("womens")],
  ["Jackets", collectionPath("jackets")],
  ["Sneakers", collectionPath("sneakers")],
  ["Hats", collectionPath("hats")],
];
