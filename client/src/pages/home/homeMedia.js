const displayCollectionTitle = (title = "") => {
  if (title === "Womens") return "Women";
  if (title === "Mens") return "Men";
  return title;
};

const decorateProduct = (collectionKey, collection, product) => ({
  ...product,
  collectionKey,
  collectionRoute: collection.routeName || collectionKey,
  collectionTitle: displayCollectionTitle(collection.title),
});

export const buildHomepageMedia = (collections, reservedImageUrls = []) => {
  const usedImages = new Set(reservedImageUrls.filter(Boolean));

  const takeProduct = (collectionKey, preferredIndexes = []) => {
    const collection = collections?.[collectionKey];
    if (!collection?.items?.length) return null;

    const candidateIndexes = [
      ...preferredIndexes,
      ...collection.items.map((_, index) => index),
    ];

    for (const index of candidateIndexes) {
      const product = collection.items[index];
      if (!product?.imageUrl || usedImages.has(product.imageUrl)) continue;
      usedImages.add(product.imageUrl);
      return decorateProduct(collectionKey, collection, product);
    }

    return null;
  };

  const takeMany = (requests) =>
    requests.map(([key, indexes]) => takeProduct(key, indexes)).filter(Boolean);

  const hero = takeMany([
    ["womens", [2, 5, 0]],
    ["mens", [0, 4, 1]],
    ["sneakers", [3, 6, 0]],
  ]);

  const edit = takeMany([
    ["jackets", [0, 1]],
    ["womens", [0, 1]],
    ["mens", [1, 2]],
    ["hats", [0, 1]],
  ]);

  const visualJournal = takeMany([
    ["hats", [2, 5]],
    ["sneakers", [4, 1]],
    ["womens", [5, 3]],
    ["mens", [4, 3]],
  ]);

  const outerwear = takeMany([
    ["jackets", [4, 2]],
    ["jackets", [2, 3, 1]],
  ]);

  return { hero, edit, visualJournal, outerwear };
};

export const getHomepageImageUrls = (media) =>
  Object.values(media)
    .flat()
    .map((item) => item.imageUrl)
    .filter(Boolean);
