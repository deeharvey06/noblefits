
import ProductListing from "../productListing/ProductListing";

const CollectionsOverview = ({ collections }) => {
  const productCount = collections
    ? Object.values(collections).reduce(
        (total, collection) => total + (collection.items?.length || 0),
        0
      )
    : 0;
  const collectionCount = collections ? Object.keys(collections).length : 0;

  return (
    <ProductListing
      collections={collections}
      eyebrow="The complete catalog"
      title="Shop all Noble Fits."
      description={`${productCount} products across ${collectionCount} collections. Filter by collection or price, then sort the catalog without losing the product details that matter.`}
    />
  );
};

export default CollectionsOverview;
