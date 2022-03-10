import Web3 from "web3";
import { toast } from "./../../../Toast/Toast";
import TokenABI from "./../../../../assets/TokenABI.json";
let web3Object;
let contractOjbect;
let currentContractAddress;
let currentTokenAddress;
let walletTypeObject = "Metamask";
let tokenContractObject;
//only for lp tokens
const convertToDecimals = async (value) => {
  const decimals = 18;
  return Number(value) / 10 ** decimals;
};

const accountsChanged = () => {
  const { ethereum } = window;
  if (ethereum) {
    ethereum.on("accountsChanged", (accounts) => {
      localStorage.clear();
      window.location.reload();
    });
    ethereum.on("networkChanged", (networkId) => {
      window.location.reload();
    });
  }
};

const isMetamaskInstalled = async () => {
  //Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum, web3 } = window;
  const result = Boolean(ethereum && ethereum.isMetaMask);
  walletTypeObject = "Metamask";
  if (result) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  } else if (ethereum) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  } else if (web3) {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } else {
    toast.error("Install Metamask extension first!");
    return false;
  }
};

// const isBinanceChainInstalled = async () => {
//   //Have to check the ethereum binding on the window object to see if it's installed
//   const { BinanceChain } = window;
//   if (BinanceChain) {
//     walletTypeObject = "BinanceChain";
//     try {
//       const accounts = await BinanceChain.request({
//         method: "eth_requestAccounts",
//       });
//       return accounts[0];
//     } catch (err) {
//       toast.error(err.message);
//       return false;
//     }
//   } else {
//     toast.error("Install BinanceChain extension first!");
//     return false;
//   }
// };

const callWeb3 = async () => {
  if (web3Object) {
    return web3Object;
  }
  const { ethereum, web3, BinanceChain } = window;
  console.log(walletTypeObject, "wallet object");
  if (walletTypeObject === "Metamask") {
    if (ethereum && ethereum.isMetaMask) {
      web3Object = new Web3(ethereum);
      return web3Object;
    } else if (ethereum) {
      web3Object = new Web3(ethereum);
      return web3Object;
    } else if (web3) {
      web3Object = new Web3(web3.currentProvider);
      return web3Object;
    } else {
      toast.error("You have to install MetaMask!");
    }
  } else {
    if (BinanceChain) {
      console.log(BinanceChain, "--------4----------");

      web3Object = new Web3(BinanceChain);
      return web3Object;
    } else {
      toast.error("You have to install MetaMask!");
    }
  }
};

const callContract = async (contractAddress, contractABI) => {
  if (
    contractOjbect &&
    currentContractAddress &&
    currentContractAddress.toLowerCase() === contractAddress.toLowerCase()
  ) {
    return contractOjbect;
  }
  const web3Object = await callWeb3();
  currentContractAddress = contractAddress;
  contractOjbect = new web3Object.eth.Contract(contractABI, contractAddress);
  return contractOjbect;
};

const callTokenContract = async (tokenAddress) => {
  if (
    tokenContractObject &&
    currentContractAddress &&
    currentTokenAddress.toLowerCase() === tokenAddress.toLowerCase()
  ) {
    return tokenContractObject;
  }
  const web3Object = await callWeb3();
  currentTokenAddress = tokenAddress;
  tokenContractObject = new web3Object.eth.Contract(
    TokenABI,
    currentTokenAddress
  );
  return tokenContractObject;
};

const calculateGasPrice = async () => {
  const web3 = await callWeb3();
  return await web3.eth.getGasPrice();
};

const getDefaultAccount = async () => {
  const web3 = await callWeb3();
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

// const approveToken = async (address, value, mainContractAddress, tokenAddress) => {
//   try {
//     console.log(tokenAddress, 'service')
//     const gasPrice = await calculateGasPrice();
//     const contract = await callTokenContract(tokenAddress);
//     //calculate estimate gas limit
//     const gas = await contract.methods.approve(mainContractAddress, value).estimateGas({ from: address });

//     return await contract.methods
//       .approve(mainContractAddress, value)
//       .send({ from: address, gasPrice, gas });
//   } catch (error) {
//     return error;
//   }
// };

// const allowanceToken = async (tokenAddress, mainContractAddress, address) => {
//   try {
//     const contract = await callTokenContract(tokenAddress);
//     return await contract.methods
//       .allowance(address, mainContractAddress).call();
//   } catch (error) {
//     return error;
//   }
// }

// const getTokenBalance = async (tokenAddress, address) => {
//   try {
//     const contract = await callTokenContract(tokenAddress);
//     const decimals = await contract.methods.decimals().call();

//     let result = await contract.methods.balanceOf(address).call();
//     result = (Number(result) / 10 ** decimals).toFixed(5);
//     return Number(result);
//   } catch (error) {
//     return error;
//   }
// };

const getTokenDetails = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    return { symbol, decimals };
  } catch (error) {
    return error;
  }
};

// const getTokenName = async (tokenAddress) => {
//   try {
//     const contract = await callTokenContract(tokenAddress);
//     return await contract.methods.name().call();
//   } catch (error) {
//     return error;
//   }
// }

const getTokenSymbol = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    return await contract.methods.symbol().call();
  } catch (error) {
    return error;
  }
};

// const getBNBBalance = async (address) => {
//   try {
//     const web3 = await callWeb3();
//     let result = await web3.eth.getBalance(address);
//     result = (Number(result) / 10 ** 18).toFixed(5);
//     return Number(result);
//   } catch (error) {
//     return error;
//   }
// }

// const setWalletType = async (walletType) => {
//   walletTypeObject = walletType;
// };

// const getTotalSupply = async (tokenAddress) => {
//   try {
//     const contract = await callTokenContract(tokenAddress);
//     let result = await contract.methods.totalSupply().call();
//     const decimals = await contract.methods.decimals().call();
//     result = Number(result) / (10 ** Number(decimals));
//     return result;
//   } catch (error) {
//     return error;
//   }
// }

// const web3ErrorHandle = async (err) => {
//   let message = "Transaction Reverted!";
//   if (err.message && err.message.indexOf("User denied") > -1) {
//     message = "User denied the transaction!";
//   } else if (err.message && err.message.indexOf("INSUFFICIENT_B") > -1) {
//     message = "Insufficient value of second token!";
//   } else if (err.message && err.message.indexOf("INSUFFICIENT_A") > -1) {
//     message = "Insufficient value of first token!";
//   } else {
//     console.log(err, err.message);
//   }
//   return message;
// };

//exporting functions
export const ContractServices = {
  isMetamaskInstalled,
  //   isBinanceChainInstalled,
  callWeb3,
  callContract,
  calculateGasPrice,
  // approveToken,
  // getTokenBalance,
  // getDecimals,
  // getTokenName,
  // getTokenSymbol,
  // getBNBBalance,
  //   setWalletType,
  //allowanceToken,
  //getTotalSupply,
  convertToDecimals,
  //   web3ErrorHandle,
  getDefaultAccount,
  accountsChanged,
  getTokenDetails,
  getTokenSymbol,
};
