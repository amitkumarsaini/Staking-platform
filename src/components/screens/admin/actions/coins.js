import { ContractServices } from "./../services/CommonServices";
import {
  CHANGE_STATUS,
  CLEAR_COINS,
  GET_INDIVIDUAL_COINS,
  EDIT_IN_ORACLE,
} from "./../redux/constants";
import {
  INVERSE_ADDRESS,
  ORACLE_ADDRESS,
  INVERSE_ADDRESS_BNB,
  ORACLE_ADDRESS_BNB,
  Uniswap_ROUTER_ETH,
  Uniswap_ROUTER_BNB,
  CRYPTO_COMPARE,
} from "./../../../../constant";
import axios from "axios";
import InverseABI from "./../../../../assets/InverseABI.json";
import OracleWrapperABI from "./../../../../assets/OracleABI.json";
import TokenABI from "./../../../../assets/TokenABI.json";
import PairABI from "./../../../../assets/PairABI.json";
import UniswapABI from "./../../../../assets/UniswapABI.json";
import { setLoader } from "./utils";
import { toast } from "../../../Toast/Toast";

let smartContractInverse;
let smartContractOracle;

const getIndividualCoins = (coin, type) => async (dispatch, getState) => {
  const contractCase = getState().admin_user.contract;

  if (contractCase === "ETH") {
    smartContractInverse = INVERSE_ADDRESS;
    smartContractOracle = ORACLE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = INVERSE_ADDRESS_BNB;
    smartContractOracle = ORACLE_ADDRESS_BNB;
  }
  dispatch({
    type: CLEAR_COINS,
  });
  try {
    dispatch(setLoader(true));
    let coinValue;
    let coinType;
    let coinsCounter;
    const contract = await ContractServices.callContract(
      smartContractInverse,
      InverseABI
    );
    const oracleContract = await ContractServices.callContract(
      smartContractOracle,
      OracleWrapperABI
    );

    if (coin === "defi") {
      coinValue = 1;
      coinsCounter = await contract.methods.defiCoinsCounter().call();
    }
    if (coin === "chain") {
      coinValue = 2;
      coinsCounter = await contract.methods.chainCoinsCounter().call();
    }
    if (coin === "nft") {
      coinValue = 3;
      coinsCounter = await contract.methods.NFTCoinsCounter().call();
    }

    if (type === "fixed") coinType = 1;
    if (type === "flexible") coinType = 2;

    for (let index = 0; index <= coinsCounter; index++) {
      let address = await contract.methods
        .coins(coinValue, coinType, index)
        .call();

      if (address !== "0x0000000000000000000000000000000000000000") {
        const oracleType = (await oracleContract.methods.coin(address).call())
          .oracleType;
        let symbol;
        if (address === "0x0000000000000000000000000000000000000001") {
          symbol = contractCase;
        } else {
          symbol = await ContractServices.getTokenSymbol(address);
        }

        const status = await contract.methods
          .coinStatus(address, coinValue, coinType)
          .call();

        dispatch({
          type: GET_INDIVIDUAL_COINS,
          payload: { oracleType, symbol, status, address },
        });
      }
    }
    dispatch(setLoader(false));
  } catch (error) {
    console.log(error);
    toast.error(error);
    dispatch(setLoader(false));
  }
};

const changeCoinStatus =
  (coin, type, elem, index) => async (dispatch, getState) => {
    const contractCase = getState().admin_user.contract;

    if (contractCase === "ETH") {
      smartContractInverse = INVERSE_ADDRESS;
      smartContractOracle = ORACLE_ADDRESS;
    } else if (contractCase === "BNB") {
      smartContractInverse = INVERSE_ADDRESS_BNB;
      smartContractOracle = ORACLE_ADDRESS_BNB;
    }
    const owner = await ContractServices.isMetamaskInstalled();
    dispatch(setLoader(true));
    let coinValue;
    let coinType;
    if (coin === "defi") coinValue = 1;
    if (coin === "chain") coinValue = 2;
    if (coin === "nft") coinValue = 3;

    if (type === "fixed") coinType = 1;
    if (type === "flexible") coinType = 2;
    try {
      const gasPrice = await ContractServices.calculateGasPrice();
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const gas = await contract.methods
        .changeCoinStaus(elem.address, coinValue, coinType, !elem.status)
        .estimateGas({ from: owner });
      const result = await contract.methods
        .changeCoinStaus(elem.address, coinValue, coinType, !elem.status)
        .send({ from: owner, gasPrice, gas });
      if (result.status === true) {
        dispatch({
          type: CHANGE_STATUS,
          payload: index,
        });
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      dispatch(setLoader(false));
    }
  };

const addCurrency =
  (
    contractAddress,
    symbol,
    _oracleAddress,
    coin,
    type,
    oracleType,
    myFunction
  ) =>
  async (dispatch, getState) => {
    const contractCase = getState().admin_user.contract;

    if (contractCase === "ETH") {
      smartContractInverse = INVERSE_ADDRESS;
      smartContractOracle = ORACLE_ADDRESS;
    } else if (contractCase === "BNB") {
      smartContractInverse = INVERSE_ADDRESS_BNB;
      smartContractOracle = ORACLE_ADDRESS_BNB;
    }
    dispatch(setLoader(true));
    const logo = await getLogo(symbol);

    const oracle = await validOracleAddress(
      _oracleAddress,
      oracleType,
      contractCase,
      contractAddress
    );
    console.log(logo, oracle);
    if (!logo || !oracle) {
      dispatch(setLoader(false));
      return toast.error("Try another token , logo or price not found");
    }

    const { coins } = getState();
    let coinArray = coins.coins;

    if (
      contractAddress === "" ||
      symbol === "" ||
      _oracleAddress === "" ||
      oracleType === "" ||
      contractAddress.length !== 42 ||
      _oracleAddress.length !== 42
    ) {
      dispatch(setLoader(false));
      return toast.error("Please fill all the fields correctly");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        for (let i = 0; i < coins.coins.length; i++) {
          if (
            coinArray[i].address.toLowerCase() === contractAddress.toLowerCase()
          ) {
            dispatch(setLoader(false));
            return toast.error("Coin already added");
          }
        }

        let coinValue, coinType;
        if (coin === "defi") coinValue = 1;
        if (coin === "chain") coinValue = 2;
        if (coin === "nft") coinValue = 3;
        if (type === "fixed") coinType = 1;
        if (type === "flexible") coinType = 2;

        const contract = await ContractServices.callContract(
          smartContractOracle,
          OracleWrapperABI
        );

        const { oracleAddress } = await contract.methods
          .coin(contractAddress)
          .call();

        if (oracleAddress === "0x0000000000000000000000000000000000000000") {
          const result = await dispatch(
            addCoinToOracle(owner, contractAddress, _oracleAddress, oracleType)
          );

          if (result.status === true) {
            toast.success("Added to Oracle");
            const inverseResult = await dispatch(
              addCoinToInvese(coinValue, coinType, contractAddress, owner)
            );
            if (inverseResult.status === true) {
              toast.success("Added to Inverse");
              dispatch(setLoader(false));
              dispatch({
                type: GET_INDIVIDUAL_COINS,
                payload: {
                  oracleType,
                  symbol,
                  status: "true",
                  address: contractAddress,
                },
              });
              dispatch(myFunction());
            }
          } else {
            dispatch(setLoader(false));
          }
        } else {
          const inverseResult = await dispatch(
            addCoinToInvese(coinValue, coinType, contractAddress, owner)
          );

          if (inverseResult.status === true) {
            toast.success("Already in oracle, Added to Inverse");
            dispatch(setLoader(false));
            dispatch({
              type: GET_INDIVIDUAL_COINS,
              payload: {
                oracleType,
                symbol,
                status: "true",
                address: contractAddress,
              },
            });
            dispatch(myFunction());
          } else {
            dispatch(setLoader(false));
          }
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
        return error;
      }
    }
  };

const addCoinToOracle =
  (owner, contractAddress, oracleAddress, oracleType) =>
  async (dispatch, getState) => {
    try {
      const contractCase = getState().admin_user.contract;

      if (contractCase === "ETH") {
        smartContractInverse = INVERSE_ADDRESS;
        smartContractOracle = ORACLE_ADDRESS;
      } else if (contractCase === "BNB") {
        smartContractInverse = INVERSE_ADDRESS_BNB;
        smartContractOracle = ORACLE_ADDRESS_BNB;
      }
      const gasPrice = await ContractServices.calculateGasPrice();

      const contract = await ContractServices.callContract(
        smartContractOracle,
        OracleWrapperABI
      );
      const gas = await contract.methods
        .setOracleAddresses(contractAddress, oracleAddress, oracleType)
        .estimateGas({ from: owner });
      let result = await contract.methods
        .setOracleAddresses(
          contractAddress,
          oracleAddress,

          oracleType
        )
        .send({ from: owner, gasPrice, gas });

      return result;
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error, "Error in adding Oracle");
      return error;
    }
  };

const addCoinToInvese =
  (coinValue, coinType, contractAddress, owner) =>
  async (dispatch, getState) => {
    const contractCase = getState().admin_user.contract;

    if (contractCase === "ETH") {
      smartContractInverse = INVERSE_ADDRESS;
      smartContractOracle = ORACLE_ADDRESS;
    } else if (contractCase === "BNB") {
      smartContractInverse = INVERSE_ADDRESS_BNB;
      smartContractOracle = ORACLE_ADDRESS_BNB;
    }
    try {
      const gasPrice = await ContractServices.calculateGasPrice();
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const gas = await contract.methods
        .addCoins(coinValue, coinType, contractAddress)
        .estimateGas({ from: owner });

      let result = await contract.methods
        .addCoins(coinValue, coinType, contractAddress)
        .send({ from: owner, gasPrice, gas });
      return result;
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error, "Error in adding inverse");
      return error;
    }
  };

const editCoinToOracle =
  (
    oracleAddress,
    myFunction,
    currentObject,
    oracleType,
    contractAddress,
    symbol
  ) =>
  async (dispatch, getState) => {
    const contractCase = getState().admin_user.contract;

    if (contractCase === "ETH") {
      smartContractInverse = INVERSE_ADDRESS;
      smartContractOracle = ORACLE_ADDRESS;
    } else if (contractCase === "BNB") {
      smartContractInverse = INVERSE_ADDRESS_BNB;
      smartContractOracle = ORACLE_ADDRESS_BNB;
    }
    if (
      oracleAddress === "" ||
      oracleType === "" ||
      oracleAddress.length !== 42
    ) {
      return toast.error("Please fill all the fields correctly");
    }

    dispatch(setLoader(true));

    const logo = await getLogo(symbol);
    const oracle = await validOracleAddress(
      oracleAddress,
      oracleType,
      contractCase,
      contractAddress
    );
    console.log(logo, oracle);
    if (!logo || !oracle) {
      dispatch(setLoader(false));
      return toast.error("Try another token , logo or price not found");
    }

    try {
      const owner = await ContractServices.isMetamaskInstalled();

      const gasPrice = await ContractServices.calculateGasPrice();
      const contract = await ContractServices.callContract(
        smartContractOracle,
        OracleWrapperABI
      );

      const gas = await contract.methods
        .setOracleAddresses(currentObject.address, oracleAddress, oracleType)
        .estimateGas({ from: owner });
      let result = await contract.methods
        .setOracleAddresses(currentObject.address, oracleAddress, oracleType)
        .send({ from: owner, gasPrice, gas });
      if (result.status === true) {
        dispatch(setLoader(false));
        dispatch({
          type: EDIT_IN_ORACLE,
          payload: {
            oracleType,
            address: currentObject.address,
          },
        });
        dispatch(myFunction());
      } else {
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
      return error;
    }
  };

const getLogo = async (sym) => {

  sym = sym.toUpperCase();
  try {
    let result = await axios({
      method: "get",
      url: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${sym}&tsyms=USD&api_key=${CRYPTO_COMPARE}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      result &&
      result.data &&
      result.data.RAW[`${sym}`] &&
      result.data.RAW[`${sym}`].USD.IMAGEURL
    ) {
      result = result.data.RAW[`${sym}`].USD.IMAGEURL;
      result = `https://www.cryptocompare.com${result}`;

      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const validOracleAddress = async (
  oracleAddress,
  oracleType,
  contractCase,
  tokenAddress
) => {
  let contract;

  try {
    if (oracleType == 1) {
      contract = await ContractServices.callContract(oracleAddress, PairABI);
      const price = await contract.methods.latestAnswer().call();

      if (price) {
        return price;
      } else {
        return false;
      }
    } else if (oracleType == 2) {
      let router;
      if (contractCase === "ETH") {
        router = Uniswap_ROUTER_ETH;
      } else if (contractCase === "BNB") {
        router = Uniswap_ROUTER_BNB;
      }
      const tokenContract = await ContractServices.callContract(
        tokenAddress,
        TokenABI
      );

      contract = await ContractServices.callContract(router, UniswapABI);

      const decimal = 10 ** (await tokenContract.methods.decimals().call());

      const price = await contract.methods
        .getAmountsOut(decimal.toString(), [
          tokenAddress.toString(),
          oracleAddress,
        ])
        .call();

      if (price) {
        return price;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  getIndividualCoins,
  changeCoinStatus,
  addCurrency,
  addCoinToOracle,
  addCoinToInvese,
  editCoinToOracle,
};
