import { call, put, takeLatest } from "redux-saga/effects";

import { fetchCollections } from "../../firebase/firebase.utils";
import { fetchCollectionsSuccess } from "./actions";
import { mergeCatalogWithFallback } from "./catalogFallback";
import ShopActionTypes from "./types";

export function* fetchCollectionsAsync() {
  try {
    const remoteCollections = yield call(fetchCollections);
    yield put(fetchCollectionsSuccess(mergeCatalogWithFallback(remoteCollections)));
  } catch {
    // Keep the storefront usable in local development and during a catalog read outage.
    // The bundled catalog is the same product set this app was originally built around.
    yield put(fetchCollectionsSuccess(mergeCatalogWithFallback()));
  }
}

export function* shopSagas() {
  yield takeLatest(ShopActionTypes.FETCH_COLLECTIONS_START, fetchCollectionsAsync);
}
