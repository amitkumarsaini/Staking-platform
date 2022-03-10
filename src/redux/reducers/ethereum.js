import { XIV_DECIMALS, FLEXIbLE_PLANS, FIXED_PLAN, BET_DAYS_FLEXIbLE, BET_DAYS_FIXED } from "../constant/actionTypes";

const initialState = {
  xiv_decimals: 0,
  flexible_Plans: [],
  fixed_plan: {},
  bet_days_flexible: [],
  bet_days_fixed: []
};

export default function ethereum(state = initialState, action = {}) {
  switch (action.type) {
    case XIV_DECIMALS:
      return { ...state, xiv_decimals: action.payload };
    case FLEXIbLE_PLANS:
      return { ...state, flexible_Plans: action.payload };
    case FIXED_PLAN:
      return { ...state, fixed_plan: action.payload };
    case BET_DAYS_FLEXIbLE:
      return { ...state, bet_days_flexible: action.payload };
    case BET_DAYS_FIXED:
      return { ...state, bet_days_fixed: action.payload };
    default:
      return state;
  }
}
