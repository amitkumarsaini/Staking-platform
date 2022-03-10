import { SET_LOADING } from "../actions/loader";

const initialState = {
  isLoading: false,
};

export default function loader(state = initialState, action = {}) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}
