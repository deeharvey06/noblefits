import { all, call } from 'redux-saga/effects';

import { fetchCollectionsStart } from '../redux/shop/sagas'
import { userSagas } from '../redux/user/sagas'

export default function* rootSagas() {
  yield all([
    call(fetchCollectionsStart),
    call(userSagas)
  ])
}