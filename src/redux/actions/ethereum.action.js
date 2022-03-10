

import { EthereumService } from "../../services/EthereumService";
import { toast } from "../../components/Toast/Toast";
import { CommonService } from "../../services/CommonService";
import { setLoader } from "../actions/loader";
import { XIV_DECIMALS } from "../constant/actionTypes";
import { XIV, DEFAULT_ADDRESS, XIV_BNB } from "../../constant";
import {
    approveNetwork
} from "./user.action";

export function callContractMethod(method, data = [], loading = true) {
    return async (dispatch, getState) => {
        try {
            let approve_Network = await approveNetwork();
            if (approve_Network) {
                if (loading) dispatch(setLoader(true))
                const result = await EthereumService.callContractGetMethod(method, data);
                if (loading) dispatch(setLoader(false))
                return result;
            }
        } catch (error) {
            console.log('error')
            if (loading) dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function getTokenAllowanceInfo(data) {
    return async (dispatch, getState) => {
        try {
            dispatch(setLoader(true))
            const result = await EthereumService.getTokenAllowanceInfo(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function getBalance(data) {
    return async (dispatch, getState) => {
        try {
            dispatch(setLoader(true))
            const result = await EthereumService.getBalance(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function getWalletBalance(data) {
    return async (dispatch, getState) => {
        try {
            dispatch(setLoader(true))
            const result = await EthereumService.getWalletBalance(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}
export function getTokenAllowance(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.getTokenAllowance(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}


export function betFixed(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.betFixed(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function betFlexible(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.betFlexible(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function getTokenDecimals(data) {
    return async (dispatch, getState) => {
        try {
            let result;
            if (DEFAULT_ADDRESS === data.tokenAddress) {
                result = 18;
            } else {
                result = await EthereumService.getTokenDecimals(data);
                if (XIV === data.tokenAddress || XIV_BNB === data.tokenAddress) dispatch({ type: XIV_DECIMALS, payload: 10 ** result });
            }

            return 10 ** result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function unStakeTokens(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.unStakeTokens(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function stakeTokens(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.stakeTokens(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function claimRewards(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.claimRewards(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function claimBets(data) {
    return async (dispatch, getState) => {
        try {
            if (!data.walletAddress) return toast.error("Please connect your wallet first");
            dispatch(setLoader(true))
            const result = await EthereumService.claimBets(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}

export function betPenalty(data) {
    return async (dispatch, getState) => {
        try {
            dispatch(setLoader(true))
            const result = await EthereumService.betPenalty(data);
            dispatch(setLoader(false))
            return result;
        } catch (error) {
            console.log('error')
            dispatch(setLoader(false))
            return toast.error(CommonService.getError(error));
        }
    };
}
