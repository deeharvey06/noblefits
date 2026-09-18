import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Spinner from "../../components/spinner/Spinner";
import { Button, ErrorState } from "../../design-system";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import {
  selectCollection,
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import CollectionPage from "./Collection";

const CollectionContainer = () => {
  const dispatch = useDispatch();
  const { collectionId } = useParams();
  const collections = useSelector(selectCollections);
  const isLoading = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);
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
        <Button
          variant="secondary"
          onClick={() => dispatch(fetchCollectionsStart())}
        >
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
