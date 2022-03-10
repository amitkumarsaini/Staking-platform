import axios from "axios";
import { toast } from "../components/Toast/Toast";
import { setLoader } from "../redux/actions/loader";
import { storeInstance } from "../App";
// import { handleTokenExpiry } from "./UserService";
import { API_HOST } from "../constant";
import { RESPONSES } from "../redux/constants";
import configureStore from "../store";
import { NETWORK } from "../redux/constant/actionTypes";
let { store, persistor } = configureStore();

axios.defaults.baseURL = API_HOST;
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config) => {
    let token = storeInstance.getState().user.token
    config.headers["Authorization"] = token
    // config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    // storeInstance.dispatch(setLoader(false));
    return error;
  }
);
// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // storeInstance.dispatch(setLoader(false));

    return response;
  },
  (error) => {
    // storeInstance.dispatch(setLoader(false));
    if (process.env.NODE_ENV !== "development") {
      // handleTokenExpiry(error);
    }
    handleError(error);

    return error;
  }
);

function formatUrl(url, params) {
  let network = localStorage.getItem("network");
  if (!network) network = 'eth';
  network = network.toUpperCase();
  params =
    params && Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}&network=${network}`
      : `?network=${network}`;
  return `${url}${params}`;
}

function handleError(error) {
  error?.data?.message && toast.error(error.data.message);
  error?.response?.data?.message && toast.error(error.response.data.message);
  error?.response?.data?.errors[0]?.message &&
    toast.error(error?.response?.data?.errors[0]?.message);
}

function handleSuccess(res) {
  if (res.status === RESPONSES.SUCCESS || res.status === RESPONSES.CREATED)
    res?.data?.message && toast.success(res.data.message);
  else {
    res?.data?.message && toast.info(res.data.message);
  }
}

export const apiCallPost = (
  url,
  data,
  params = {},
  showToast = false,
  showLoader = true
) =>
  new Promise((resolve) => {
    showLoader && storeInstance.dispatch(setLoader(true));
    axios
      .post(formatUrl(url, params), data)
      .then((res) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        showToast && handleSuccess(res);
        resolve(res.data);
      })
      .catch((error) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        resolve(null);
      });
  });

export const apiCallGet = (
  url,
  params = {},
  showToast = false,
  showLoader = true
) =>
  new Promise((resolve) => {
    showLoader && storeInstance.dispatch(setLoader(true));
    axios
      .get(formatUrl(url, params))
      .then((res) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        showToast && handleSuccess(res);

        resolve(res.data);
      })
      .catch((error) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        resolve(null);
      });
  });

export const apiCallPut = (
  url,
  data,
  params = {},
  showToast = false,
  showLoader = true
) =>
  new Promise((resolve) => {
    showLoader && storeInstance.dispatch(setLoader(true));
    axios
      .put(formatUrl(url, params), data)
      .then((res) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        showToast && handleSuccess(res);
        resolve(res.data);
      })
      .catch((error) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        resolve(null);
      });
  });

export const apiCallPatch = (
  url,
  data,
  params = {},
  showToast = false,
  showLoader = true
) =>
  new Promise((resolve) => {
    showLoader && storeInstance.dispatch(setLoader(true));
    axios
      .patch(formatUrl(url, params), data)
      .then((res) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        showToast && handleSuccess(res);
        resolve(res.data);
      })
      .catch((error) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        resolve(null);
      });
  });

export const apiCallDelete = (
  url,
  params = {},
  showToast = false,
  showLoader = true
) =>
  new Promise((resolve) => {
    showLoader && storeInstance.dispatch(setLoader(true));
    axios
      .delete(formatUrl(url, params))
      .then((res) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        showToast && handleSuccess(res);
        resolve(res.data);
      })
      .catch((error) => {
        showLoader && storeInstance.dispatch(setLoader(false));
        resolve(null);
      });
  });
