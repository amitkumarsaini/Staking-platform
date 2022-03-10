import {
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  CHNAGE_NETWORK,
} from "./../constants";

const initialState = {
  contract: "BNB",
  adminAddress: null,
  isLoggedIn: false,
};

const admin_user = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        adminAddress: payload,
        isLoggedIn: true,
      };
    case ADMIN_LOGIN_FAIL:
      return {
        ...state,
        adminAddress: null,
        isLoggedIn: false,
      };
    case CHNAGE_NETWORK:
      return {
        ...state,
        contract: payload,
      };
    default:
      return state;
  }
};

export default admin_user;
