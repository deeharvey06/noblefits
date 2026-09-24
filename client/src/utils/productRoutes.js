export const normalizeCollectionDisplayTitle = (title = "") => {
  if (title === "Womens") return "Women";
  if (title === "Mens") return "Men";
  return title;
};

export { productPath as getProductPath } from "@/config/routes";

export const findCollectionByRoute = (collections, collectionRoute) => {
  if (!collections || !collectionRoute) return null;

  return (
    collections[collectionRoute] ||
    Object.values(collections).find(
      (collection) =>
        (collection.routeName || collection.title?.toLowerCase()) ===
        collectionRoute,
    ) ||
    null
  );
};

export const findProductByRoute = (collections, collectionRoute, productId) => {
  const collection = findCollectionByRoute(collections, collectionRoute);
  if (!collection) return { collection: null, product: null };

  const product = (collection.items || []).find(
    (item) => String(item.id) === String(productId),
  );

  return { collection, product: product || null };
};

export const getProductImages = (product) => {
  if (!product) return [];

  const images = Array.isArray(product.images)
    ? product.images
        .map((image) =>
          typeof image === "string"
            ? { src: image, alt: product.name }
            : {
                src: image?.src || image?.url,
                alt: image?.alt || product.name,
              },
        )
        .filter((image) => Boolean(image.src))
    : [];

  if (images.length > 0) return images;
  return product.imageUrl ? [{ src: product.imageUrl, alt: product.name }] : [];
};

export const getRelatedProducts = (collection, productId, limit = 4) =>
  (collection?.items || [])
    .filter((item) => String(item.id) !== String(productId))
    .slice(0, limit);
