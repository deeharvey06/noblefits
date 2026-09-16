import UserActionTypes from "./types";

const INITIAL_STATE = {
  currentUser: null,
  error: null,
  errorContext: null,
  status: "idle",
  sessionChecked: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.CHECK_USER_SESSION:
      return {
        ...state,
        status: "checking-session",
      };
    case UserActionTypes.SESSION_CHECK_COMPLETE:
      return {
        ...state,
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.SESSION_CHECK_FAILURE:
      return {
        ...state,
        error: action.payload,
        errorContext: "session",
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.GOOGLE_SIGN_IN_START:
    case UserActionTypes.EMAIL_SIGN_IN_START:
    case UserActionTypes.SIGN_UP_START:
      return {
        ...state,
        status: "submitting",
        error: null,
        errorContext: null,
      };
    case UserActionTypes.SIGN_OUT_START:
      return {
        ...state,
        status: "signing-out",
        error: null,
        errorContext: null,
      };
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
        errorContext: null,
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        error: null,
        errorContext: null,
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        error: action.payload,
        errorContext: "sign-in",
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: action.payload,
        errorContext: "sign-up",
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.SIGN_OUT_FAILURE:
      return {
        ...state,
        error: action.payload,
        errorContext: "sign-out",
        status: "idle",
        sessionChecked: true,
      };
    case UserActionTypes.CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
        errorContext: null,
      };
    default:
      return state;
  }
};

export default userReducer;
