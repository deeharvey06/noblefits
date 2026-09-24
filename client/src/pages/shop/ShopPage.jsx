import { ROUTES } from "@/config/routes";
import { Suspense } from "react";
import { Route, Routes } from "react-router";

import Spinner from "@/components/spinner/Spinner";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

const CollectionsOverviewContainer = lazyWithRetry(
  () => import("@/components/collectionsOverview/CollectionsOverviewContainer"),
  "shop-overview",
);
const CollectionPageContainer = lazyWithRetry(
  () => import("@/pages/collection/CollectionContainer"),
  "collection",
);
const ProductDetailPage = lazyWithRetry(
  () => import("@/pages/productDetail/ProductDetailPage"),
  "product-detail",
);
const NotFoundPage = lazyWithRetry(
  () => import("@/pages/notFound/NotFoundPage"),
  "shop-not-found",
);

const ShopPage = () => {
  return (
    <div className="shop-page">
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<CollectionsOverviewContainer />} />
          <Route path={ROUTES.productPattern} element={<ProductDetailPage />} />
          <Route
            path={ROUTES.collectionPattern}
            element={<CollectionPageContainer />}
          />
          <Route path={ROUTES.notFound} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default ShopPage;
