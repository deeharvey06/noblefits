import { all, call } from "redux-saga/effects";

import { shopSagas } from "@/redux/shop/sagas";
import { userSagas } from "@/redux/user/sagas";
import { cartSagas } from "@/redux/cart/sagas";

export default function* rootSagas() {
  yield all([call(shopSagas), call(cartSagas), call(userSagas)]);
}
