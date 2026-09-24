import { useDispatch, useSelector } from "react-redux";
import { fetchCollectionsStart } from "@/redux/shop/actions";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "@/redux/shop/shopSelector";

// Initial loading belongs to application startup. This hook subscribes and exposes retry.
export const useCatalog = () => {
  const dispatch = useDispatch();
  const collections = useSelector(selectCollections);
  const isFetching = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);
  const retry = () => dispatch(fetchCollectionsStart());
  return { collections, isFetching, errorMessage, retry };
};
