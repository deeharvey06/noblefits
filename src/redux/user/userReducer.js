import { SET_CURRENT_USER } from "./actions";

const INITIAL_STORE = {
  currentUser: null,
};

const userReducer = (state = INITIAL_STORE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
