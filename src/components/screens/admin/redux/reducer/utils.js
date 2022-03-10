import { SET_LOADER } from "./../constants";

const initialState = {
  loader: false,
};

const utilsReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_LOADER:
      return {
        ...state,
        loader: payload,
      };

    default:
      return state;
  }
};

export default utilsReducer;
