import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import React, { useEffect, useState } from "react";
import { Container, Form, Row } from "react-bootstrap";
import NavbarTop from "../navbarTop/NavbarTop";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import InputInline from "../../../common/InputInline/InputInline";
import { toast } from "../../../Toast/Toast";
import { ContractServices } from "../services/CommonServices";
import { setLoader } from "../actions/utils";
import { useDispatch, useSelector } from "react-redux";
import { INVERSE_ADDRESS, INVERSE_ADDRESS_BNB } from "../../../../constant";
import InverseABI from "../../../../assets/InverseABI.json";
import { useHistory } from "react-router-dom";

const Plans = ({ currentPlan, action, resetComponent, id }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const label = ["Drop Percentage", "Risk Percentage", "Reward Percentage"];
  const label = ["Drop Percentage", "Risk Percentage", "Reward Percentage"];
  const [form, setFormData] = useState({});

  const contractCase = useSelector((state) => state.admin_user.contract);
  let smartContractInverse;
  if (contractCase === "ETH") {
    smartContractInverse = INVERSE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = INVERSE_ADDRESS_BNB;
  }

  useEffect(() => {
    let state = form;
    label.map((elem, index) => {
      let labels = elem.replace(" ", "");

      state = {
        ...state,
        [labels]: action === "update" ? currentPlan[index] : "",
      };
    });

    setFormData(state);
  }, []);

  const onChange = (event, name) => {
    if (
      event.target.value === "" ||
      (!isNaN(event.target.value) && event.target.value.match("^[^.]+$"))
    ) {
      setFormData({ ...form, [name]: event.target.value });
    }
  };

  const onUpdate = (name) => {
    if (name === "DropPercentage") {
      setDropValue(name);
    } else if (name === "RiskPercentage") {
      setRiskValue(name);
    } else if (name === "RewardPercentage") {
      setRewardValue(name);
    }
  };

  const setDropValue = async (name) => {
    if (form[name] === "") {
      return toast.error("Field can't be empty");
    } else {
      if (form[name] <= 0 || form[name] > 100) {
        return toast.error("Drop must be in between 1 and 100");
      }
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));

        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );

        const gas = await contract.methods
          .setDropValue(id, form[name])
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setDropValue(id, form[name])
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const plan = await contract.methods.plans(id).call();
          resetComponent(id, plan, action);
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

  const setRiskValue = async (name) => {
    if (form[name] === "") {
      return toast.error("Field can't be empty");
    } else {
      if (form[name] > 100) {
        return toast.error("Risk cant be grearter then 100");
      }
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .setRisk(id, form[name])
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setRisk(id, form[name])
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const plan = await contract.methods.plans(id).call();
          resetComponent(id, plan, action);
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

  const setRewardValue = async (name) => {
    if (form[name] === "") {
      return toast.error("Field can't be empty");
    } else {
      if (form[name] <= 0) {
        return toast.error("Reward should be gretaer then zero");
      }
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .setReward(id, form[name])
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setReward(id, form[name])
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const plan = await contract.methods.plans(id).call();

          resetComponent(id, plan, action);
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

  const addPlan = async (name) => {
    if (
      form["RiskPercentage"] === "" ||
      form["DropPercentage"] === "" ||
      form["RewardPercentage"] === ""
    ) {
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
          .addPlan(
            form["RewardPercentage"],
            form["RiskPercentage"],
            form["DropPercentage"],
            true
          )
          .estimateGas({ from: owner });

        const result = await contract.methods
          .addPlan(
            form["RewardPercentage"],
            form["RiskPercentage"],
            form["DropPercentage"],
            true
          )
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          let result = await contract.methods.planCounter().call();
          result = await contract.methods.plans(result).call();
          resetComponent(id, result, action);
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

  return (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <NavbarTop />
        <HeaderAdmin
          title={`${
            action === "update" ? "Update" : "Add"
          } Fixed individual coins`}
        />
        <Container fluid>
          <Row>
            <Form>
              {label.map((elem, index) => (
                <InputInline
                  key={index}
                  onChange={(e) => onChange(e, elem.replace(" ", ""))}
                  show={action !== "update"}
                  label={elem}
                  value={form[elem.replace(" ", "")] || ""}
                  onClickUpdate={() => onUpdate(elem.replace(" ", ""), index)}
                />
              ))}
              <ButtonCustom onClick={() => resetComponent()} title="Cancel" />
              {action === "add" && (
                <ButtonCustom onClick={() => addPlan()} title="Submit" />
              )}
            </Form>
          </Row>
        </Container>
      </Container>
    </Container>
  );
};

export default Plans;
