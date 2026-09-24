const CATEGORY_ORDER = ["mens", "womens", "jackets", "sneakers", "hats"];

export const normalizeSearchText = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

export const displayCollectionTitle = (title = "") => {
  if (title === "Mens") return "Men";
  if (title === "Womens") return "Women";
  return title;
};

export const buildSearchCatalog = (collections) => {
  if (!collections) return { products: [], categories: [] };

  const categories = Object.entries(collections)
    .map(([key, collection]) => ({
      key,
      title: displayCollectionTitle(collection.title || key),
      routeName: collection.routeName || key,
      itemCount: (collection.items || []).length,
    }))
    .sort((left, right) => {
      const leftIndex = CATEGORY_ORDER.indexOf(left.key);
      const rightIndex = CATEGORY_ORDER.indexOf(right.key);
      const safeLeft = leftIndex === -1 ? CATEGORY_ORDER.length : leftIndex;
      const safeRight = rightIndex === -1 ? CATEGORY_ORDER.length : rightIndex;
      return safeLeft - safeRight;
    });

  const products = Object.entries(collections).flatMap(([key, collection]) => {
    const routeName = collection.routeName || key;
    const collectionTitle = displayCollectionTitle(collection.title || key);

    return (collection.items || []).map((item) => ({
      ...item,
      collectionKey: key,
      collectionTitle,
      routeName,
    }));
  });

  return { products, categories };
};

const editDistance = (left = "", right = "") => {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const previous = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );
  const current = new Array(right.length + 1);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost =
        left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }

    for (let index = 0; index <= right.length; index += 1) {
      previous[index] = current[index];
    }
  }

  return previous[right.length];
};

const fuzzyThreshold = (token) => {
  if (token.length >= 8) return 2;
  if (token.length >= 5) return 2;
  if (token.length >= 3) return 1;
  return 0;
};

const scoreText = (query, candidate) => {
  const normalizedCandidate = normalizeSearchText(candidate);
  if (!query || !normalizedCandidate) return { score: 0, exact: false };

  const compactQuery = query.replace(/\s+/g, "");
  const compactCandidate = normalizedCandidate.replace(/\s+/g, "");

  if (normalizedCandidate === query) return { score: 120, exact: true };
  if (normalizedCandidate.startsWith(query)) return { score: 105, exact: true };
  if (compactCandidate === compactQuery) return { score: 102, exact: true };
  if (query.length >= 4 && normalizedCandidate.includes(query))
    return { score: 95, exact: true };
  if (compactQuery.length >= 4 && compactCandidate.includes(compactQuery))
    return { score: 92, exact: true };

  const queryTokens = query.split(" ").filter(Boolean);
  const candidateTokens = normalizedCandidate.split(" ").filter(Boolean);

  const directTokenMatch = queryTokens.every((queryToken) =>
    candidateTokens.some(
      (candidateToken) =>
        candidateToken === queryToken ||
        candidateToken.startsWith(queryToken) ||
        (queryToken.length >= 4 && candidateToken.includes(queryToken)),
    ),
  );

  if (directTokenMatch) return { score: 82, exact: true };

  const fuzzyTokenMatch = queryTokens.every((queryToken) => {
    const threshold = fuzzyThreshold(queryToken);
    if (!threshold) return false;

    return candidateTokens.some(
      (candidateToken) => editDistance(queryToken, candidateToken) <= threshold,
    );
  });

  return fuzzyTokenMatch
    ? { score: 55, exact: false }
    : { score: 0, exact: false };
};

export const searchCatalog = ({
  products = [],
  categories = [],
  query = "",
}) => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return {
      normalizedQuery,
      products: [],
      categories: [],
      suggestions: [],
      totalProducts: 0,
      hasExactMatch: false,
      fuzzyOnly: false,
    };
  }

  const rankedCategories = categories
    .map((category, index) => {
      const titleMatch = scoreText(normalizedQuery, category.title);
      const routeMatch = scoreText(normalizedQuery, category.routeName);
      const best =
        titleMatch.score >= routeMatch.score ? titleMatch : routeMatch;

      return {
        ...category,
        searchScore: best.score + 5,
        exactMatch: best.exact,
        catalogIndex: index,
      };
    })
    .filter((category) => category.searchScore > 5)
    .sort(
      (left, right) =>
        right.searchScore - left.searchScore ||
        left.catalogIndex - right.catalogIndex,
    );

  const rankedProducts = products
    .map((product, index) => {
      const nameMatch = scoreText(normalizedQuery, product.name);
      const collectionMatch = scoreText(
        normalizedQuery,
        product.collectionTitle,
      );
      const bestScore = Math.max(
        nameMatch.score,
        collectionMatch.score ? collectionMatch.score - 18 : 0,
      );
      const exactMatch =
        nameMatch.score >= collectionMatch.score - 18
          ? nameMatch.exact
          : collectionMatch.exact;

      return {
        ...product,
        searchScore: bestScore,
        exactMatch,
        catalogIndex: index,
      };
    })
    .filter((product) => product.searchScore > 0)
    .sort(
      (left, right) =>
        right.searchScore - left.searchScore ||
        left.catalogIndex - right.catalogIndex,
    );

  const suggestionCandidates = [
    ...rankedCategories.map((category) => category.title),
    ...rankedProducts.map((product) => product.name),
  ];
  const suggestions = [...new Set(suggestionCandidates)].slice(0, 6);
  const hasExactMatch =
    rankedProducts.some((product) => product.exactMatch) ||
    rankedCategories.some((category) => category.exactMatch);

  return {
    normalizedQuery,
    products: rankedProducts,
    categories: rankedCategories,
    suggestions,
    totalProducts: rankedProducts.length,
    hasExactMatch,
    fuzzyOnly:
      !hasExactMatch &&
      (rankedProducts.length > 0 || rankedCategories.length > 0),
  };
};
