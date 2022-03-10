import {
  CHANGE_STATUS,
  CLEAR_COINS,
  EDIT_IN_ORACLE,
  GET_INDIVIDUAL_COINS,
} from "./../constants";

const initialState = {
  coins: [],
};

const coinsReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_INDIVIDUAL_COINS:
      return {
        ...state,
        coins: [...state.coins, payload],
      };

    case CHANGE_STATUS:
      return {
        ...state,
        coins: state.coins.map((elem, index) => {
          if (payload === index) {
            elem.status = !elem.status;
            return elem;
          } else {
            return elem;
          }
        }),
      };
    case EDIT_IN_ORACLE:
      return {
        ...state,
        coins: state.coins.map((elem) => {
          if (payload.address.toLowerCase() === elem.address.toLowerCase()) {
            elem.oracleType = payload.oracleType;
            return elem;
          } else {
            return elem;
          }
        }),
      };
    case CLEAR_COINS:
      return {
        ...state,
        coins: [],
      };

    default:
      return state;
  }
};

export default coinsReducer;
