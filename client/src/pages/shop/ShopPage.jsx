import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router";

import Spinner from "../../components/spinner/Spinner";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import { lazyWithRetry } from "../../utils/lazyWithRetry";

const CollectionsOverviewContainer = lazyWithRetry(
  () =>
    import("../../components/collectionsOverview/CollectionsOverviewContainer"),
  "shop-overview",
);
const CollectionPageContainer = lazyWithRetry(
  () => import("../collection/CollectionContainer"),
  "collection",
);
const ProductDetailPage = lazyWithRetry(
  () => import("../productDetail/ProductDetailPage"),
  "product-detail",
);
const NotFoundPage = lazyWithRetry(
  () => import("../notFound/NotFoundPage"),
  "shop-not-found",
);

const ShopPage = () => {
  const dispatch = useDispatch();
  const collections = useSelector(selectCollections);
  const isFetching = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);

  useEffect(() => {
    if (!collections && !isFetching && !errorMessage) {
      dispatch(fetchCollectionsStart());
    }
  }, [collections, dispatch, errorMessage, isFetching]);

  return (
    <div className="shop-page">
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<CollectionsOverviewContainer />} />
          <Route
            path=":collectionId/:productId"
            element={<ProductDetailPage />}
          />
          <Route path=":collectionId" element={<CollectionPageContainer />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default ShopPage;
