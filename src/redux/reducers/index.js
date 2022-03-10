import { combineReducers } from "redux";
import admin_user from "./../../components/screens/admin/redux/reducer/user";
import utils from "./../../components/screens/admin/redux/reducer/utils";
import coins from "./../../components/screens/admin/redux/reducer/coins";
import loader from "./loader";
import user from "./user_reducer";
import ethereum from "./ethereum";
export default combineReducers({
  admin_user,
  utils,
  coins,
  loader,
  user,
  ethereum,
});
