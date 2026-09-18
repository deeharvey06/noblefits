import { createSelector } from "@reduxjs/toolkit";

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser,
);

export const selectUserError = createSelector(
  [selectUser],
  (user) => user.error,
);

export const selectUserStatus = createSelector(
  [selectUser],
  (user) => user.status,
);

export const selectSessionChecked = createSelector(
  [selectUser],
  (user) => user.sessionChecked,
);

export const selectUserErrorContext = createSelector(
  [selectUser],
  (user) => user.errorContext,
);
