import { useLocalCatalog } from "@/config/clientConfig";
import { call, put, takeLatest } from "redux-saga/effects";

import { catalogApi } from "@/api/catalogApi";
import { fetchCollectionsSuccess } from "@/redux/shop/actions";
import { mergeCatalogWithFallback } from "@/redux/shop/catalogFallback";
import ShopActionTypes from "@/redux/shop/types";

export function* fetchCollectionsAsync() {
  try {
    const remoteCollections = useLocalCatalog
      ? null
      : yield call(catalogApi.getCollections);
    yield put(
      fetchCollectionsSuccess(mergeCatalogWithFallback(remoteCollections)),
    );
  } catch {
    // Keep the storefront usable in local development and during a catalog read outage.
    // The bundled catalog is the same product set this app was originally built around.
    yield put(fetchCollectionsSuccess(mergeCatalogWithFallback()));
  }
}

export function* shopSagas() {
  yield takeLatest(
    ShopActionTypes.FETCH_COLLECTIONS_START,
    fetchCollectionsAsync,
  );
}
