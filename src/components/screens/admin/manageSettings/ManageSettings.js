import React, { useEffect, useState } from "react";
import { Container, Row, Form } from "react-bootstrap";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import "../manageSettings/ManageSettingsStyle.css";
import InputInline from "../../../common/InputInline/InputInline";
import NavbarTop from "../navbarTop/NavbarTop";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  INVERSE_ADDRESS,
  INVERSE_ADDRESS_BNB,
  OWNER,
} from "./../../../../constant";
import InverseABI from "./../../../../assets/InverseABI.json";
import { ContractServices } from "../services/CommonServices";
import { toast } from "../../../Toast/Toast";
import { setLoader } from "../actions/utils";
import { adminLogOut } from "../actions/user";

const ManageSettings = () => {
  const dispatch = useDispatch();
  const owner = useSelector((state) => state.admin_user.adminAddress);

  const contractCase = useSelector((state) => state.admin_user.contract);
  let smartContractInverse;
  if (contractCase === "ETH") {
    smartContractInverse = INVERSE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = INVERSE_ADDRESS_BNB;
  }

  const [formData, setFormData] = useState({
    minXIVStakeValue: "",
    maxXIVStakeValue: "",
    stakedValueToLVRatioValue: "",
    minimumLiquidityVault: "",
    maximumLiquidityVault: "",
    adminAddressValue: "",
    revokeCommissionAddressValue: "",
    betFees: "",
    isActive: "",
  });

  const {
    minXIVStakeValue,
    maxXIVStakeValue,
    stakedValueToLVRatioValue,
    minimumLiquidityVault,
    maximumLiquidityVault,
    revokeCommissionAddressValue,
    adminAddressValue,
    betFees,
    isActive,
  } = formData;

  useEffect(() => {
    getContractDetails();
  }, []);

  const onChange = (event, name) => {
    if (
      event.target.value === "" ||
      (!isNaN(event.target.value) && event.target.value.match("^[^.]+$"))
    ) {
      setFormData({ ...formData, [name]: event.target.value });
    }
  };
  const getContractDetails = async () => {
    try {
      dispatch(setLoader(true));
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const minXIVStake = BigNumber(
        await contract.methods.miniStakeAmount().call()
      )
        .dividedBy(BigNumber(10).pow(18))
        .toFixed();

      const miniBetAmount = BigNumber(
        await contract.methods.miniBetAmount().call()
      )
        .dividedBy(BigNumber(10).pow(18))
        .toFixed();

      const maxXIVStake = BigNumber(
        await contract.methods.maxStakeAmount().call()
      )
        .dividedBy(BigNumber(10).pow(18))
        .toFixed();

      const maxBetAmount = BigNumber(
        await contract.methods.maxBetAmount().call()
      )
        .dividedBy(BigNumber(10).pow(18))
        .toFixed();

      const betfees = await contract.methods.betFees().call();
      const revokeAddress = await contract.methods
        .revokeComissionAddress()
        .call();

      const betFactorLP = await contract.methods.betFactorLP().call();
      const multiTokenActive = await contract.methods
        .isMultiTokenActive()
        .call();

      setFormData({
        ...formData,
        minXIVStakeValue: minXIVStake,
        maxXIVStakeValue: maxXIVStake,
        stakedValueToLVRatioValue: betFactorLP,
        adminAddressValue: owner,
        minimumLiquidityVault: miniBetAmount,
        maximumLiquidityVault: maxBetAmount,
        betFees: betfees,
        revokeCommissionAddressValue: revokeAddress,
        isActive: multiTokenActive,
      });

      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const updateOwner = async () => {
    if (adminAddressValue === "") {
      return toast.error("Field can't be empty");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .transferOwnership(adminAddressValue)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .transferOwnership(adminAddressValue)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          dispatch(adminLogOut());
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const updateBetFactorLP = async () => {
    if (stakedValueToLVRatioValue === "") {
      return toast.error("Field can't be empty");
    } else if (stakedValueToLVRatioValue <= 0) {
      return toast.error("Bet factor should be greater then zero");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .updateBetFactorLP(stakedValueToLVRatioValue)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .updateBetFactorLP(stakedValueToLVRatioValue)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = await contract.methods.betFactorLP().call();
          setFormData({
            ...formData,
            stakedValueToLVRatioValue: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const updateMaxStakevalue = async () => {
    if (maxXIVStakeValue === "") {
      return toast.error("Field can't be empty");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        let a = BigNumber(maxXIVStakeValue).multipliedBy(BigNumber(10).pow(18));
        a = a.toFixed();
        console.log(a, "before4");

        const gas = await contract.methods
          .updateMaxStakeAmount(a)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .updateMaxStakeAmount(a)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = BigNumber(
            await contract.methods.maxStakeAmount().call()
          )
            .dividedBy(BigNumber(10).pow(18))
            .toFixed();
          setFormData({
            ...formData,
            maxXIVStakeValue: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const updateMinStakevalue = async () => {
    if (minXIVStakeValue === "") {
      return toast.error("Field can't be empty");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        let a = BigNumber(minXIVStakeValue).multipliedBy(BigNumber(10).pow(18));
        a = a.toFixed();
        console.log(a, "before");

        const gas = await contract.methods
          .updateMiniStakeAmount(a)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .updateMiniStakeAmount(a)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = BigNumber(
            await contract.methods.miniStakeAmount().call()
          )
            .dividedBy(BigNumber(10).pow(18))
            .toFixed();

          setFormData({
            ...formData,
            minXIVStakeValue: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const updateMiniBetAmount = async () => {
    if (minimumLiquidityVault === "") {
      return toast.error("Field can't be empty");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        let a = BigNumber(minimumLiquidityVault).multipliedBy(
          BigNumber(10).pow(18)
        );
        a = a.toFixed();
        console.log(a, "before2");

        const gas = await contract.methods
          .updateMinBetAmount(a)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .updateMinBetAmount(a)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = BigNumber(
            await contract.methods.miniBetAmount().call()
          )
            .dividedBy(BigNumber(10).pow(18))
            .toFixed();
          setFormData({
            ...formData,
            minimumLiquidityVault: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const setBetFees = async () => {
    if (betFees === "") {
      return toast.error("Field can't be empty");
    } else if (betFees > 100) {
      return toast.error("Percentage cant be greater then 100");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .setBetFees(betFees)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setBetFees(betFees)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = await contract.methods.betFees().call();
          setFormData({
            ...formData,
            betFees: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const updateMaxBetAmount = async () => {
    if (maximumLiquidityVault === "") {
      return toast.error("Field can't be empty");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        let a = BigNumber(maximumLiquidityVault).multipliedBy(
          BigNumber(10).pow(18)
        );
        a = a.toFixed();
        console.log(a, "before2");

        const gas = await contract.methods
          .updateMaxBetAmount(a)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .updateMaxBetAmount(a)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = BigNumber(await contract.methods.maxBetAmount().call())
            .dividedBy(BigNumber(10).pow(18))
            .toFixed();

          setFormData({
            ...formData,
            maximumLiquidityVault: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const setRevokeAddressFees = async () => {
    if (revokeCommissionAddressValue === "") {
      return toast.error("Field can't be empty");
    } else {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .setRevokeComissionAddress(revokeCommissionAddressValue)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setRevokeComissionAddress(revokeCommissionAddressValue)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const result = await contract.methods.revokeComissionAddress().call();

          setFormData({
            ...formData,
            revokeCommissionAddressValue: result,
          });
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        dispatch(setLoader(false));
        console.log(error);
      }
    }
  };

  const changeMultiTokenStatus = async (value) => {
    try {
      const owner = await ContractServices.isMetamaskInstalled();
      dispatch(setLoader(true));
      const gasPrice = await ContractServices.calculateGasPrice();
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const gas = await contract.methods
        .setMultiTokenStatus(value)
        .estimateGas({ from: owner });
      const result = await contract.methods
        .setMultiTokenStatus(value)
        .send({ from: owner, gasPrice, gas });
      if (result.status === true) {
        const multiTokenActive = await contract.methods
          .isMultiTokenActive()
          .call();

        setFormData({
          ...formData,
          isActive: multiTokenActive,
        });
        dispatch(setLoader(false));
      } else {
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  return (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <NavbarTop />
        <HeaderAdmin title="Settings" />
        <Container fluid>
          <Row>
            <Form>
              <InputInline
                label="Min Liquidity Vault :"
                value={minXIVStakeValue}
                onChange={(e) => onChange(e, "minXIVStakeValue")}
                onClickUpdate={() => updateMinStakevalue()}
              />
              <InputInline
                label="Max Liquidity Vault :"
                value={maxXIVStakeValue}
                onChange={(e) => onChange(e, "maxXIVStakeValue")}
                onClickUpdate={() => updateMaxStakevalue()}
              />
              <InputInline
                label="Staked Value To LV Ratio :"
                value={stakedValueToLVRatioValue}
                onChange={(e) => onChange(e, "stakedValueToLVRatioValue")}
                onClickUpdate={() => updateBetFactorLP()}
              />
              <InputInline
                label="Minimum XIV Stake :"
                value={minimumLiquidityVault}
                onChange={(e) => onChange(e, "minimumLiquidityVault")}
                onClickUpdate={() => updateMiniBetAmount()}
              />
              <InputInline
                label="Maximum XIV Stake :"
                value={maximumLiquidityVault}
                onChange={(e) => onChange(e, "maximumLiquidityVault")}
                onClickUpdate={() => updateMaxBetAmount()}
              />
              <InputInline
                label="Admin Address:"
                value={adminAddressValue || ""}
                onChange={(e) => onChange(e, "adminAddressValue")}
                onClickUpdate={() => updateOwner()}
              />
              <InputInline
                label="Bet Fees:"
                value={betFees}
                onChange={(e) => onChange(e, "betFees")}
                onClickUpdate={() => setBetFees()}
              />
              <InputInline
                label="Revoke Commission Address:"
                value={revokeCommissionAddressValue}
                onChange={(e) => onChange(e, "revokeCommissionAddressValue")}
                onClickUpdate={() => setRevokeAddressFees()}
              />
              <div className="row">
                <Form.Label
                  style={{ fontSize: "15px" }}
                  className="col-md-2 col-12"
                >
                  isMultitokenActive :
                </Form.Label>
                <div className="col-md-8">
                  <Form.Check
                    onChange={(e) => changeMultiTokenStatus(!isActive)}
                    type="switch"
                    label=""
                    checked={isActive}
                  />
                </div>
              </div>
            </Form>
          </Row>
        </Container>
      </Container>
    </Container>
  );
};

export default ManageSettings;
