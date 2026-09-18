import { all, call, put, takeLatest } from "redux-saga/effects";

import UserActionTypes from "./types";
import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
  sessionCheckComplete,
  sessionCheckFailure,
} from "./actions";
import {
  createAuthUser,
  getCurrentUser,
  getUserProfileSnapshot,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
} from "../../firebase/firebase.utils";

const normalizeAuthError = (error) => ({
  code: error?.code || "auth/unknown-error",
  message: error?.message || "Authentication failed.",
});

export function* getUserProfile(userAuth, additionalData) {
  const userSnapshot = yield call(
    getUserProfileSnapshot,
    userAuth,
    additionalData,
  );

  if (!userSnapshot || !userSnapshot.exists()) {
    throw new Error("The user profile could not be loaded.");
  }

  const userData = userSnapshot.data();
  const createdAt =
    typeof userData.createdAt?.toDate === "function"
      ? userData.createdAt.toDate().toISOString()
      : userData.createdAt || null;

  return { id: userSnapshot.id, ...userData, createdAt };
}

export function* signInWithGoogleSaga() {
  try {
    const { user } = yield call(signInWithGoogle);
    const profile = yield call(getUserProfile, user);
    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(signInFailure(normalizeAuthError(error)));
  }
}

export function* signInWithEmailSaga({ payload: { email, password } }) {
  try {
    const { user } = yield call(signInWithEmail, email, password);
    const profile = yield call(getUserProfile, user);
    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(signInFailure(normalizeAuthError(error)));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield call(getCurrentUser);
    if (!userAuth) {
      yield put(sessionCheckComplete());
      return;
    }

    const profile = yield call(getUserProfile, userAuth);
    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(sessionCheckFailure(normalizeAuthError(error)));
  }
}

export function* signOutSaga() {
  try {
    yield call(signOutUser);
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(normalizeAuthError(error)));
  }
}

export function* signUp({ payload: { email, password, displayName } }) {
  try {
    const { user } = yield call(createAuthUser, email, password);
    yield put(signUpSuccess({ user, additionalData: { displayName } }));
  } catch (error) {
    yield put(signUpFailure(normalizeAuthError(error)));
  }
}

export function* signInAfterSignUp({ payload: { user, additionalData } }) {
  try {
    const profile = yield call(getUserProfile, user, additionalData);
    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(signUpFailure(normalizeAuthError(error)));
  }
}

export function* userSagas() {
  yield all([
    takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogleSaga),
    takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmailSaga),
    takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated),
    takeLatest(UserActionTypes.SIGN_OUT_START, signOutSaga),
    takeLatest(UserActionTypes.SIGN_UP_START, signUp),
    takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp),
  ]);
}
