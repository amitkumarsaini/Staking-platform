import { SET_LOADER } from "./../redux/constants";

export const setLoader = (param) => async (dispatch) => {
  dispatch({
    type: SET_LOADER,
    payload: param,
  });
};
