import { useCatalog } from "@/hooks/useCatalog";

import { Button, ErrorState } from "@/design-system";
import Spinner from "@/components/spinner/Spinner";
import CollectionsOverview from "@/components/collectionsOverview/CollectionsOverview";

const CollectionsOverviewContainer = () => {
  const {
    collections,
    isFetching: isLoading,
    errorMessage,
    retry,
  } = useCatalog();

  if (isLoading && !collections) return <Spinner />;

  if (errorMessage && !collections) {
    return (
      <ErrorState
        eyebrow="Catalog unavailable"
        title="We could not load the shop."
        description="Try loading the catalog again."
      >
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      </ErrorState>
    );
  }

  return <CollectionsOverview collections={collections} />;
};

export default CollectionsOverviewContainer;
