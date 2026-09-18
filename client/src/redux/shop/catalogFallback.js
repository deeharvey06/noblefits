import SHOP_DATA from "./shopData";

const normalizeCollection = (key, collection) => ({
  ...collection,
  routeName: collection.routeName || key,
  items: Array.isArray(collection.items) ? collection.items : [],
});

export const mergeCatalogWithFallback = (remoteCollections = {}) => {
  const safeRemote =
    remoteCollections && typeof remoteCollections === "object"
      ? remoteCollections
      : {};

  const completeCatalog = Object.entries(SHOP_DATA).reduce(
    (catalog, [key, fallbackCollection]) => {
      const remoteCollection = safeRemote[key];
      const hasRemoteItems =
        Array.isArray(remoteCollection?.items) &&
        remoteCollection.items.length > 0;

      catalog[key] = normalizeCollection(
        key,
        hasRemoteItems
          ? {
              ...fallbackCollection,
              ...remoteCollection,
              items: remoteCollection.items,
            }
          : fallbackCollection,
      );
      return catalog;
    },
    {},
  );

  Object.entries(safeRemote).forEach(([key, collection]) => {
    if (
      !completeCatalog[key] &&
      Array.isArray(collection?.items) &&
      collection.items.length > 0
    ) {
      completeCatalog[key] = normalizeCollection(key, collection);
    }
  });

  return completeCatalog;
};

export const getLocalCatalog = () => mergeCatalogWithFallback();
