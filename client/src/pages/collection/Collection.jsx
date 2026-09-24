import ProductListing from "@/components/productListing/ProductListing";
import { normalizeCollectionTitle } from "@/components/productListing/catalogControls";
import { EmptyState } from "@/design-system";

const CollectionPage = ({ collection, collectionKey, collections }) => {
  if (!collection) {
    return (
      <EmptyState
        title="Collection not found"
        description="This collection is unavailable or no longer exists."
      />
    );
  }

  const displayTitle = normalizeCollectionTitle(collection.title);
  const productCount = collection.items?.length || 0;

  return (
    <ProductListing
      key={collectionKey}
      collections={collections}
      collectionKey={collectionKey}
      eyebrow={`${displayTitle} collection`}
      title={displayTitle}
      description={`Browse all ${productCount} ${productCount === 1 ? "product" : "products"} in the ${displayTitle} collection. Sort by name or price, or narrow the collection using the price filter.`}
    />
  );
};

export default CollectionPage;
