import { all, call } from 'redux-saga/effects';

import { shopSagas } from './shop/sagas';
import { userSagas } from './user/sagas'
import { cartSagas } from './cart/sagas';

export default function* rootSagas() {
  yield all([
    call(shopSagas),
    call(cartSagas),
    call(userSagas)
  ])
}