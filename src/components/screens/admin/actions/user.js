import { ContractServices } from "./../services/CommonServices";
import {
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  CHNAGE_NETWORK,
} from "./../redux/constants";
import { INVERSE_ADDRESS, INVERSE_ADDRESS_BNB } from "./../../../../constant";
import InverseABI from "./../../../../assets/InverseABI.json";
import { setLoader } from "./utils";
import { toast } from "../../../Toast/Toast";

let smartContractInverse;

const checkOwner = () => async (dispatch, getState) => {
  const contractCase = getState().admin_user.contract;

  try {
    if (contractCase === "ETH") {
      smartContractInverse = INVERSE_ADDRESS;
    } else if (contractCase === "BNB") {
      smartContractInverse = INVERSE_ADDRESS_BNB;
    }
    dispatch(setLoader(true));

    const walletAddress = await ContractServices.isMetamaskInstalled();
    console.log(
      "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      contractCase,
      smartContractInverse,
      InverseABI
    );
    const contract = await ContractServices.callContract(
      smartContractInverse,
      InverseABI
    );

    const owner = await contract.methods.owner().call();
    console.log(
      "ooooooooooooooooooooooooooooooooooooooooo",
      contractCase,
      smartContractInverse,
      InverseABI
    );
    console.log(owner.toLowerCase(), walletAddress.toLowerCase());
    if (owner.toLowerCase() === walletAddress.toLowerCase()) {
      dispatch({
        type: ADMIN_LOGIN_SUCCESS,
        payload: owner,
      });

      dispatch(setLoader(false));
    } else {
      toast.error("Only admin has the access");

      dispatch({
        type: ADMIN_LOGIN_FAIL,
      });
      dispatch(setLoader(false));
    }
  } catch (error) {
    console.log(error);
    dispatch(setLoader(false));
    toast.error(error);
    dispatch({
      type: ADMIN_LOGIN_FAIL,
    });
  }
};

const adminLogOut = () => async (dispatch) => {
  dispatch({
    type: ADMIN_LOGIN_FAIL,
  });
};

const changeNetwork = (network) => async (dispatch) => {
  dispatch({
    type: CHNAGE_NETWORK,
    payload: network,
  });
  window.location.reload();
};

export { adminLogOut, checkOwner, changeNetwork };
