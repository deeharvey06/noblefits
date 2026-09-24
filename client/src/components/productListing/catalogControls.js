const COLLECTION_ORDER = ["mens", "womens", "jackets", "sneakers", "hats"];

export const PRICE_FILTERS = [
  { id: "all", label: "All prices", matches: () => true },
  { id: "under-50", label: "Under $50", matches: (price) => price < 50 },
  {
    id: "50-99",
    label: "$50–$99",
    matches: (price) => price >= 50 && price < 100,
  },
  {
    id: "100-199",
    label: "$100–$199",
    matches: (price) => price >= 100 && price < 200,
  },
  { id: "200-plus", label: "$200+", matches: (price) => price >= 200 },
];

export const normalizeCollectionTitle = (title = "") => {
  if (title === "Womens") return "Women";
  if (title === "Mens") return "Men";
  return title;
};

export const collectionsToArray = (collections) => {
  if (!collections) return [];

  const entries = Object.entries(collections);
  return entries
    .sort(([keyA], [keyB]) => {
      const indexA = COLLECTION_ORDER.indexOf(keyA);
      const indexB = COLLECTION_ORDER.indexOf(keyB);
      const safeA = indexA === -1 ? COLLECTION_ORDER.length : indexA;
      const safeB = indexB === -1 ? COLLECTION_ORDER.length : indexB;
      return safeA - safeB;
    })
    .map(([key, collection]) => ({
      ...collection,
      key,
      displayTitle: normalizeCollectionTitle(collection.title),
    }));
};

export const flattenCatalog = (collections) =>
  collectionsToArray(collections).flatMap((collection) =>
    (collection.items || []).map((item) => ({
      ...item,
      collectionKey: collection.key,
      collectionTitle: collection.displayTitle,
      collectionRoute: collection.routeName || collection.key,
    })),
  );

export const applyCatalogControls = ({
  products,
  selectedCollections = [],
  priceFilter = "all",
  sortBy = "catalog",
}) => {
  const priceRule =
    PRICE_FILTERS.find((filter) => filter.id === priceFilter) ||
    PRICE_FILTERS[0];

  const filtered = products.filter((product) => {
    const collectionMatches =
      selectedCollections.length === 0 ||
      selectedCollections.includes(product.collectionKey);
    return collectionMatches && priceRule.matches(product.price);
  });

  if (sortBy === "price-asc")
    return [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")
    return [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
};
