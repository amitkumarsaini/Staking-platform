import Web3 from "web3";
import configureStore from "../store";
import InverseABI from "../assets/InverseABI.json";
import DynamicABI from "../assets/DynamicABI.json";
import {
    INVERSE_ADDRESS,
    INVERSE_ADDRESS_BNB,
} from "../constant";
import BigNumber from "big-number";
import {
    approveNetwork
} from "../redux/actions/user.action";
import { Alert } from "bootstrap";

let web3Instance, InverseInstance;
let { store, persistor } = configureStore();

const callWeb3 = () => {
    return new Promise(async (resolve, reject) => {
        if (!web3Instance) {
            const { ethereum } = window;
            if (ethereum) {
                web3Instance = new Web3(ethereum);
            } else if (window.web3) {
                web3Instance = new Web3(window.web3.currentProvider);
            }
        }
        resolve(web3Instance);
    });
};

const calllobalFunction = async () => {
    let web3 = await callWeb3();
    let network = await localStorage.getItem("network");
    if (network === "bnb") {
        InverseInstance = new web3.eth.Contract(InverseABI, INVERSE_ADDRESS_BNB);
    } else {
        InverseInstance = new web3.eth.Contract(InverseABI, INVERSE_ADDRESS);
    }
    return true;
};

calllobalFunction();

const createInverseInstance = async () => {
    let approve_Network = await approveNetwork();
    if (approve_Network) {
        return new Promise(async (resolve, reject) => {
            if (InverseInstance) {
                resolve(InverseInstance);
            } else {
                calllobalFunction().then(() => {
                    resolve(InverseInstance);
                })
                    .catch(reject);
            }
        });
    }
};

const createDynamicInstance = async (dynamicAddress) => {
    let approve_Network = await approveNetwork();
    if (approve_Network) {
        return new Promise(async (resolve, reject) => {
            let myDynamicContractInstance = await new web3Instance.eth.Contract(
                DynamicABI,
                dynamicAddress
            );
            resolve(myDynamicContractInstance);
        });
    }
};

const callContractGetMethod = async (method, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                let _parmsLength = data.length;
                if (_parmsLength) {
                    switch (_parmsLength) {
                        case 1:
                            contract.methods[method](data[0]).call().then((result) => {
                                resolve(result);
                            })
                                .catch((error) => { reject(error) });
                            break;
                        case 2:
                            contract.methods[method](data[0], data[1]).call().then((result) => {
                                resolve(result);
                            })
                                .catch((error) => { reject(error) });
                            break;
                        case 3:
                            contract.methods[method](data[0], data[1], data[2]).call().then((result) => {
                                resolve(result);
                            })
                                .catch((error) => { reject(error) });
                            break;
                        case 4:
                            contract.methods[method](data[0], data[1], data[2], data[3]).call().then((result) => {
                                resolve(result);
                            })
                                .catch((error) => { reject(error) });
                            break;
                        case 5:
                            contract.methods[method](data[0], data[1], data[2], data[3], data[4]).call().then((result) => {
                                resolve(result);
                            })
                                .catch((error) => { reject(error) });
                            break;
                        default:
                            contract.methods[method](data[0]).call().then((result) => {
                                resolve(result);
                            })
                                .catch((error) => { reject(error) });
                    }
                } else {
                    contract.methods[method]().call().then((result) => {
                        resolve(result);
                    })
                        .catch((error) => { reject(error) });
                }

            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getTokenDecimals = async (data) => {
    const myDynamicContractInstance = await createDynamicInstance(data.tokenAddress);
    return new Promise(async (resolve, reject) => {
        try {
            if (myDynamicContractInstance.methods) {
                myDynamicContractInstance.methods
                    .decimals()
                    .call()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(reject);
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });
};

const getTokenAllowanceInfo = async (data) => {
    const myDynamicContractInstance = await createDynamicInstance(data.tokenAddress);
    let _address = INVERSE_ADDRESS;
    let network = await localStorage.getItem("network");
    if (network === "bnb") {
        _address = INVERSE_ADDRESS_BNB
    }
    return new Promise(async (resolve, reject) => {
        try {
            if (myDynamicContractInstance.methods) {
                myDynamicContractInstance.methods
                    .allowance(data.walletAddress, _address)
                    .call()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(reject);
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });
};

const getBalance = async (data) => {
    const myDynamicContractInstance = await createDynamicInstance(data.tokenAddress);
    return new Promise(async (resolve, reject) => {
        try {
            if (myDynamicContractInstance.methods) {
                myDynamicContractInstance.methods
                    .balanceOf(data.walletAddress)
                    .call()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(reject);
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });
};

const getWalletBalance = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            web3Instance.eth.getBalance(data.walletAddress)
                .then((result) => {
                    resolve(result);
                })
                .catch(reject);
        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });
};
const getTokenAllowance = async (data) => {
    let maxlimit = BigNumber(10).power(40)
    maxlimit = maxlimit.toString()
    let _address = INVERSE_ADDRESS;
    let network = await localStorage.getItem("network");
    if (network === "bnb") {
        _address = INVERSE_ADDRESS_BNB
    }
    const myDynamicContractInstance = await createDynamicInstance(data.tokenAddress);
    return new Promise(async (resolve, reject) => {
        try {
            if (myDynamicContractInstance.methods) {
                let limit = data.status ? maxlimit : 0
                myDynamicContractInstance.methods
                    .approve(_address, limit)
                    .send({ from: data.walletAddress })
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log('error ', error)
                        reject(error);
                    });
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });
};

const betFixed = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                if (data.type === 1) {
                    const gasLimit = await contract.methods.betFixed(data.amount, data.coinType, data.coinAddress, data.betToken, data._isInverse).estimateGas({ from: data.walletAddress, value: data.amount })
                    contract.methods.
                        betFixed(data.amount, data.coinType, data.coinAddress, data.betToken, data._isInverse)
                        .send({ from: data.walletAddress, gasLimit, value: data.amount }).then((result) => {
                            resolve(result);
                        })
                        .catch((error) => { reject(error) });
                } else {
                    const gasLimit = await contract.methods.betFixed(data.amount, data.coinType, data.coinAddress, data.betToken, data._isInverse).estimateGas({ from: data.walletAddress })
                    contract.methods.
                        betFixed(data.amount, data.coinType, data.coinAddress, data.betToken, data._isInverse)
                        .send({ from: data.walletAddress, gasLimit }).then((result) => {
                            resolve(result);
                        })
                        .catch((error) => { reject(error) });
                }

            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const betFlexible = async (data) => {
    console.log('data - ', data)
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                if (data.type === 1) {
                    const gasLimit = await contract.methods.betFlexible(data.amount, data.coinType, data.coinAddress, data.betToken, data.index, data._daysIndex, data._isInverse).estimateGas({ from: data.walletAddress, value: data.amount })
                    contract.methods.
                        betFlexible(data.amount, data.coinType, data.coinAddress, data.betToken, data.index, data._daysIndex, data._isInverse)
                        .send({ from: data.walletAddress, gasLimit, value: data.amount }).then((result) => {
                            resolve(result);
                        })
                        .catch((error) => { reject(error) });
                } else {
                    const gasLimit = await contract.methods.betFlexible(data.amount, data.coinType, data.coinAddress, data.betToken, data.index, data._daysIndex, data._isInverse).estimateGas({ from: data.walletAddress })
                    contract.methods.
                        betFlexible(data.amount, data.coinType, data.coinAddress, data.betToken, data.index, data._daysIndex, data._isInverse)
                        .send({ from: data.walletAddress, gasLimit }).then((result) => {
                            resolve(result);
                        })
                        .catch((error) => { reject(error) });
                }

            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const stakeTokens = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                const gasLimit = await contract.methods.stakeTokens(data.amount).estimateGas({ from: data.walletAddress })
                contract.methods.
                    stakeTokens(data.amount)
                    .send({ from: data.walletAddress, gasLimit }).then((result) => {
                        resolve(result);
                    })
                    .catch((error) => { reject(error) });
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const unStakeTokens = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                const gasLimit = await contract.methods.unstakeTokens(data.amount).estimateGas({ from: data.walletAddress })
                contract.methods.
                    unstakeTokens(data.amount)
                    .send({ from: data.walletAddress, gasLimit }).then((result) => {
                        resolve(result);
                    })
                    .catch((error) => { reject(error) });
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const claimRewards = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                const gasLimit = await contract.methods.claimRewards().estimateGas({ from: data.walletAddress })
                contract.methods.
                    claimRewards()
                    .send({ from: data.walletAddress, gasLimit }).then((result) => {
                        resolve(result);
                    })
                    .catch((error) => { reject(error) });
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const claimBets = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                const gasLimit = await contract.methods.claimBets().estimateGas({ from: data.walletAddress })
                contract.methods.
                    claimBets()
                    .send({ from: data.walletAddress, gasLimit }).then((result) => {
                        resolve(result);
                    })
                    .catch((error) => { reject(error) });
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const betPenalty = async (data) => {
    console.log("betPenalty - > - ", data)
    return new Promise(async (resolve, reject) => {
        try {
            const contract = await createInverseInstance();
            if (contract.methods) {
                const gasLimit = await contract.methods.betPenalty(data.betIndex).estimateGas({ from: data.walletAddress })
                contract.methods.
                    betPenalty(data.betIndex)
                    .send({ from: data.walletAddress, gasLimit }).then((result) => {
                        resolve(result);
                    })
                    .catch((error) => { reject(error) });
            } else {
                reject(new Error("Contract not found."));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const EthereumService = {
    callContractGetMethod,
    getTokenAllowanceInfo,
    getTokenAllowance,
    betFixed,
    betFlexible,
    getTokenDecimals,
    unStakeTokens,
    stakeTokens,
    claimRewards,
    getBalance,
    claimBets,
    betPenalty,
    getWalletBalance
};