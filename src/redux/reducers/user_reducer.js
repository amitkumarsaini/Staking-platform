import {
  USER_ADDRESS,
  USER_WALLET,
  PLATFORM,
  NETWORK,
  USER_THEME
} from "../constant/actionTypes";

const initialState = {
  walletAddress: "",
  balance: 0,
  lightMode: false,
  wallet: "",
  spdxBalance: 0,
  userRegisterDetails: {},
  userDetails: {},
  token: "",
  isLoggedIn: false,
  platform: 1,
  network: 'eth',
  theme: 'dark'
};

export default function user(state = initialState, { type, payload }) {
  switch (type) {
    case USER_ADDRESS:
      return { ...state, walletAddress: payload };
    case USER_WALLET:
      return { ...state, wallet: payload };
    case PLATFORM:
      return { ...state, platform: payload };
    case NETWORK:
      return { ...state, network: payload };
    case USER_THEME:
      return { ...state, theme: payload };
    default:
      return state;
  }
}
