import { all, call, put, takeLatest } from "redux-saga/effects";

import UserActionTypes from "@/redux/user/types";
import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
  sessionCheckComplete,
  sessionCheckFailure,
} from "@/redux/user/actions";
import { authApi } from "@/api/authApi";

const normalizeAuthError = (error) => ({
  code: error?.code || "auth/unknown-error",
  message: error?.message || "Authentication failed.",
});

export function* signInWithGoogleSaga() {
  try {
    const profile = yield call(authApi.signInWithGoogle);
    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(signInFailure(normalizeAuthError(error)));
  }
}

export function* signInWithEmailSaga({ payload: { email, password } }) {
  try {
    const profile = yield call(authApi.signInWithEmail, email, password);
    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(signInFailure(normalizeAuthError(error)));
  }
}

export function* isUserAuthenticated() {
  try {
    const profile = yield call(authApi.getSession);
    if (!profile) {
      yield put(sessionCheckComplete());
      return;
    }

    yield put(signInSuccess(profile));
  } catch (error) {
    yield put(sessionCheckFailure(normalizeAuthError(error)));
  }
}

export function* signOutSaga() {
  try {
    yield call(authApi.signOut);
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(normalizeAuthError(error)));
  }
}

export function* signUp({ payload: { email, password, displayName } }) {
  try {
    const profile = yield call(authApi.signUp, {
      email,
      password,
      displayName,
    });
    yield put(signUpSuccess(profile));
  } catch (error) {
    yield put(signUpFailure(normalizeAuthError(error)));
  }
}

export function* signInAfterSignUp({ payload: profile }) {
  yield put(signInSuccess(profile));
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
