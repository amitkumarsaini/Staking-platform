import React, { useEffect, useState } from "react";
import { Container, Form, Table } from "react-bootstrap";
import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import NavbarTop from "../navbarTop/NavbarTop";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../actions/utils";
import { ContractServices } from "../services/CommonServices";
import { INVERSE_ADDRESS, INVERSE_ADDRESS_BNB } from "../../../../constant";
import InverseABI from "../../../../assets/InverseABI.json";
import Plans from "./Plans";

const ManageFlexibleIndividualPlan = () => {
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [updateComponent, showUpdateComponent] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({});
  const [action, setAction] = useState("");
  const [id, setID] = useState("");

  useEffect(() => {
    getPlanDetails();
  }, []);
  const contractCase = useSelector((state) => state.admin_user.contract);
  let smartContractInverse;
  if (contractCase === "ETH") {
    smartContractInverse = INVERSE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = INVERSE_ADDRESS_BNB;
  }

  const getPlanDetails = async () => {
    try {
      dispatch(setLoader(true));
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const result = await contract.methods.planCounter().call();

      for (let i = 0; i < result; i++) {
        if (i >= 1) {
          const plan = await contract.methods.plans(i).call();
          setPlans((plans) => [...plans, plan]);
        }
      }
      dispatch(setLoader(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  const handleClick = (elem, action, index) => {
    setCurrentPlan(elem);
    setID(index);
    setAction(action);
    showUpdateComponent(!updateComponent);
  };

  const resetComponent = async (index, plan, action) => {
    if (action !== "changeStatus") {
      setCurrentPlan({});
      setAction("");
      setID("");
      showUpdateComponent(!updateComponent);
    }
    if (action === "update" || action === "changeStatus") {
      setPlans(
        plans.map((elem, i) => {
          if (i === index) {
            return plan;
          }
          return elem;
        })
      );
    } else if (action === "add") {
      setPlans([...plans, plan]);
    }
  };

  const addClickHandler = (action) => {
    showUpdateComponent(!updateComponent);
    setAction(action);
  };

  const changeCoinStatus = async (e, index, action) => {
    try {
      const owner = await ContractServices.isMetamaskInstalled();
      dispatch(setLoader(true));

      const gasPrice = await ContractServices.calculateGasPrice();
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const gas = await contract.methods
        .setStatus(index, action)
        .estimateGas({ from: owner });
      const result = await contract.methods
        .setStatus(index, action)
        .send({ from: owner, gasPrice, gas });
      if (result.status === true) {
        const plan = await contract.methods.plans(index).call();
        resetComponent(index - 1, plan, "changeStatus");
        dispatch(setLoader(false));
      } else {
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  return !updateComponent ? (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <NavbarTop />
        <HeaderAdmin title="Manage Flexible Individual Plan">
          <ButtonCustom
            onClick={() => addClickHandler("add")}
            title="Add Plan"
          />
        </HeaderAdmin>
        <Table responsive>
          <thead>
            <tr>
              <th>Drop Percentage</th>
              <th>Risk Percentage </th>
              <th>Reward Percentage </th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {plans.map((elem, index) => (
              <tr key={index}>
                <td>{elem.drop}</td>
                <td>{elem.risk}</td>
                <td>{elem.reward}</td>
                <td>
                  <Form.Check
                    type="switch"
                    onChange={(e) =>
                      changeCoinStatus(e, index + 1, !elem.isActive)
                    }
                    label=""
                    checked={elem.isActive}
                  />
                </td>
                <td>
                  <ButtonCustom
                    onClick={() => handleClick(elem, "update", index)}
                    title="Edit"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Container>
  ) : (
    <Plans
      currentPlan={[currentPlan.drop, currentPlan.risk, currentPlan.reward]}
      action={action}
      id={id}
      resetComponent={resetComponent}
    />
  );
};

export default ManageFlexibleIndividualPlan;
