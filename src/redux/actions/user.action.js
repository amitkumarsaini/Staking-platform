import {
    USER_ADDRESS,
    USER_WALLET,
    PLATFORM,
    NETWORK,
    USER_THEME
} from "../constant/actionTypes";
import { toast } from "../../components/Toast/Toast";
import { CAIN_ID, CAIN_ID_BNB } from "../../constant";
import Web3 from "web3";
import configureStore from "../../store";

export const isMetaMaskInstalled = async () => {
    const { ethereum, web3 } = window;
    const result = await Boolean(ethereum);
    return result;
};

export const connectmetamask = () => {
    return (dispatch, getState) =>
        new Promise(async (resolve, reject) => {
            const installed = await isMetaMaskInstalled();

            try {
                let address;
                if (installed) {
                    const { ethereum, web3 } = window;
                    let network = await localStorage.getItem("network");
                    const chainId = await ethereum.request({ method: 'eth_chainId' });
                    if (network === "bnb" && CAIN_ID_BNB !== chainId) {
                        toast.error("Please switch the network");
                    }
                    else if (network === "eth" && CAIN_ID !== chainId) {
                        toast.error("Please switch the network");
                    }
                    let validNetwork = await approveNetwork();
                    if (validNetwork) {
                        ethereum.on("accountsChanged", async function (accounts) {
                            address = accounts[0];
                            dispatch({ type: USER_WALLET, payload: "MetaMask" });
                            setTimeout(function () {
                                window.location.reload();
                            }, 300);
                            return dispatch({ type: USER_ADDRESS, payload: address });
                        });
                        ethereum.on('networkChanged', function (networkId) {
                            setTimeout(function () { window.location.reload(); }, 1000);
                        })
                        const accounts = await ethereum.request({
                            method: "eth_requestAccounts",
                        });
                        address = accounts[0];
                        dispatch({ type: USER_WALLET, payload: "MetaMask" });
                        resolve(address);
                        return dispatch({ type: USER_ADDRESS, payload: address });
                    }
                } else {
                    reject(false);
                    return toast.error("Please install metamask");
                }
            } catch (error) {
                reject(false);
                return toast.error(error.message);
            }
        });
};

export const connectTrustWallet = () => async (dispatch, getState) => {
    try {
        const { ethereum } = window;
        const result = Boolean((ethereum && ethereum.isMetaMask));
        if (!result) {
            const web3 = await new Web3(window.web3.currentProvider);
            const accounts = await web3.eth.getAccounts();
            let address = accounts[0];
            dispatch({ type: USER_ADDRESS, payload: address });
            return dispatch({ type: USER_WALLET, payload: "TrustWallet" });
        } else {
            return toast.error("Trust Wallet Not installed!");
        }
    } catch (error) {
        return toast.error(error.message);
    }
};

export const approveNetwork = async () => {
    return new Promise(async (resolve, reject) => {
        // let network = await localStorage.getItem("network");
        // if (network === "bnb") {
        if (CAIN_ID_BNB === "0x61") {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x61' }]
                }).then((result) => {
                    resolve(true)
                })
            }
            catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        const result = await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: "0x61",
                                    chainName: "Binance Test Network",
                                    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                                    blockExplorerUrls: ["https://testnet.bscscan.com/"],
                                    iconUrls: ["https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg"],
                                    nativeCurrency: {
                                        name: "BNB",
                                        symbol: "BNB",
                                        decimals: 18,
                                    },
                                }
                            ],
                        }).then((result) => {
                            resolve(true)
                        })
                    } catch (addError) {
                        toast.error(addError.message);
                        resolve(false);
                    }
                }
            }
        } else {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }]
                }).then((result) => {
                    resolve(true)
                })
            }
            catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        const result = await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: "0x38",
                                    chainName: "Binance Mainnet",
                                    rpcUrls: ["https://bsc-dataseed.binance.org/"],
                                    blockExplorerUrls: ["https://bscscan.com/"],
                                    iconUrls: ["https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg"],
                                    nativeCurrency: {
                                        name: "BNB",
                                        symbol: "BNB",
                                        decimals: 18,
                                    },
                                }
                            ],
                        }).then((result) => {
                            resolve(true)
                        })
                        return result;
                    } catch (addError) {
                        toast.error(addError.message);
                        resolve(false)
                    }
                }
            }
        }
        //     } else {
        //         if (CAIN_ID === '0x4') {
        //             try {
        //                 await window.ethereum.request({
        //                     method: 'wallet_switchEthereumChain',
        //                     params: [{ chainId: '0x4' }]
        //                 }).then((result) => {
        //                     resolve(true)
        //                 })
        //             }
        //             catch (switchError) {
        //                 if (switchError.code === 4902) {
        //                     try {
        //                         const result = await window.ethereum.request({
        //                             method: 'wallet_addEthereumChain',
        //                             params: [
        //                                 {
        //                                     chainId: "0x4",
        //                                     chainName: "Rinkeby Test Network",
        //                                     rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        //                                     blockExplorerUrls: ["https://rinkeby.etherscan.io"],
        //                                     iconUrls: ["https://upload.wikimedia.org/wikipedia/commons/b/b7/ETHEREUM-YOUTUBE-PROFILE-PIC.png"],
        //                                     nativeCurrency: {
        //                                         name: "ETH",
        //                                         symbol: "ETH",
        //                                         decimals: 18,
        //                                     },
        //                                 }
        //                             ],
        //                         }).then((result) => {
        //                             resolve(true)
        //                         })
        //                     } catch (addError) {
        //                         toast.error(addError.message);
        //                         resolve(false);
        //                     }
        //                 }
        //             }
        //         } else {
        //             try {
        //                 await window.ethereum.request({
        //                     method: 'wallet_switchEthereumChain',
        //                     params: [{ chainId: '0x1' }]
        //                 }).then((result) => {
        //                     resolve(true)
        //                 })
        //             }
        //             catch (switchError) {
        //                 if (switchError.code === 4902) {
        //                     try {
        //                         const result = await window.ethereum.request({
        //                             method: 'wallet_addEthereumChain',
        //                             params: [
        //                                 {
        //                                     chainId: "0x1",
        //                                     chainName: "Ethereum Mainnet",
        //                                     rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        //                                     blockExplorerUrls: ["https://etherscan.io"],
        //                                     iconUrls: ["https://upload.wikimedia.org/wikipedia/commons/b/b7/ETHEREUM-YOUTUBE-PROFILE-PIC.png"],
        //                                     nativeCurrency: {
        //                                         name: "ETH",
        //                                         symbol: "ETH",
        //                                         decimals: 18,
        //                                     },
        //                                 }
        //                             ],
        //                         }).then((result) => {
        //                             resolve(true)
        //                         })
        //                         return result;
        //                     } catch (addError) {
        //                         toast.error(addError.message);
        //                         resolve(false)
        //                     }
        //                 }
        //             }
        //         }
        //     }

    });
}

approveNetwork();
export const disconnectWallet = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_WALLET, payload: "" });
        dispatch({ type: USER_ADDRESS, payload: "" });
    } catch (error) {
        return toast.error(error.message);
    }
};


export const setUserPlatform = (platform) => async (dispatch, getState) => {
    try {
        dispatch({ type: PLATFORM, payload: platform });
    } catch (error) {
        return toast.error(error.message);
    }
};

export const setUserTheme = (theme) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_THEME, payload: theme });
    } catch (error) {
        return toast.error(error.message);
    }
};

export const setNetworkChnageAction = (type) => async (dispatch, getState) => {
    try {
        console.log("setNetworkChnageAction---", type)
        dispatch({ type: NETWORK, payload: type });
    } catch (error) {
        return toast.error(error.message);
    }
};





