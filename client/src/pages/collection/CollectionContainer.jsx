import { useCatalog } from "@/hooks/useCatalog";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import Spinner from "@/components/spinner/Spinner";
import { Button, ErrorState } from "@/design-system";
import { selectCollection } from "@/redux/shop/shopSelector";
import CollectionPage from "@/pages/collection/Collection";

const CollectionContainer = () => {
  const {
    collections,
    isFetching: isLoading,
    errorMessage,
    retry,
  } = useCatalog();
  const { collectionId } = useParams();
  const collectionSelector = useMemo(
    () => selectCollection(collectionId),
    [collectionId],
  );
  const collection = useSelector(collectionSelector);

  if (isLoading && !collections) return <Spinner />;

  if (errorMessage && !collections) {
    return (
      <ErrorState
        eyebrow="Collection unavailable"
        title="We could not load this collection."
        description="Try loading the catalog again."
      >
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      </ErrorState>
    );
  }

  return (
    <CollectionPage
      collection={collection}
      collectionKey={collectionId}
      collections={collections}
    />
  );
};

export default CollectionContainer;
