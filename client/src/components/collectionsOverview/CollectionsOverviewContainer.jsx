import { useDispatch, useSelector } from "react-redux";

import { Button, ErrorState } from "../../design-system";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import Spinner from "../spinner/Spinner";
import CollectionsOverview from "./CollectionsOverview";

const CollectionsOverviewContainer = () => {
  const dispatch = useDispatch();
  const collections = useSelector(selectCollections);
  const isLoading = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);

  if (isLoading && !collections) return <Spinner />;

  if (errorMessage && !collections) {
    return (
      <ErrorState
        eyebrow="Catalog unavailable"
        title="We could not load the shop."
        description="Try loading the catalog again."
      >
        <Button
          variant="secondary"
          onClick={() => dispatch(fetchCollectionsStart())}
        >
          Try again
        </Button>
      </ErrorState>
    );
  }

  return <CollectionsOverview collections={collections} />;
};

export default CollectionsOverviewContainer;
