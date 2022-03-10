import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import InputInline from "../../../common/InputInline/InputInline";
import Switch from "react-switch";
import NavbarTop from "../navbarTop/NavbarTop";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../actions/utils";
import { INVERSE_ADDRESS, INVERSE_ADDRESS_BNB } from "./../../../../constant";
import InverseABI from "./../../../../assets/InverseABI.json";
import { ContractServices } from "../services/CommonServices";
import { toast } from "../../../Toast/Toast";

const ManageTimeIndividual = () => {
  const [plansDays, setPlanDays] = useState([]);
  const [buttonIndex, setButtonIndex] = useState("");
  const [inputValue, setInputvalue] = useState("");
  const [counter, setCounter] = useState("");
  const [addValue, setAddValue] = useState("");

  const contractCase = useSelector((state) => state.admin_user.contract);
  let smartContractInverse;
  if (contractCase === "ETH") {
    smartContractInverse = INVERSE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = INVERSE_ADDRESS_BNB;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    getPlanDayCounter();
  }, []);

  const toggle = (index, day) => {
    setPlanDays(
      plansDays.map((elem, i) => {
        if (index === i) {
          elem = day;
        }
        return elem;
      })
    );
  };

  const getPlanDayCounter = async () => {
    try {
      dispatch(setLoader(true));
      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const result = await contract.methods.planDaysCounter().call();
      setCounter(result);

      for (let i = 0; i < result; i++) {
        if (i >= 1) {
          const day = await contract.methods.planDaysIndexed(i).call();
          setPlanDays((plansDays) => [...plansDays, day]);
        }
      }

      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const changeButton = async (index, action, elem) => {
    setButtonIndex(index);
    if (action === "Edit") {
      setInputvalue(elem);
    } else {
      if (inputValue === elem) {
        return toast.error("Day already exists");
      } else if (inputValue === "") {
        return toast.error("Enter valid days to change");
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
            .setPlanDays(index + 1, inputValue)
            .estimateGas({ from: owner });
          const result = await contract.methods
            .setPlanDays(index + 1, inputValue)
            .send({ from: owner, gasPrice, gas });

          if (result.status === true) {
            setButtonIndex("");
            const day = await contract.methods
              .planDaysIndexed(index + 1)
              .call();
            toggle(index, day);
            dispatch(setLoader(false));
          } else {
            dispatch(setLoader(false));
          }
        } catch (error) {
          console.log(error);
          dispatch(setLoader(false));
        }
      }
    }
  };

  const addnewDay = async () => {
    if (addValue !== "") {
      try {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .setPlanDays(counter, addValue)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setPlanDays(counter, addValue)
          .send({ from: owner, gasPrice, gas });
        if (result.status === true) {
          const day = await contract.methods.planDaysIndexed(counter).call();
          setAddValue("");
          setPlanDays([...plansDays, day]);
          dispatch(setLoader(false));
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        console.log(error);
        dispatch(setLoader(false));
      }
    } else {
      return toast.error("Add a day first");
    }
  };

  const onChange = (event, action) => {
    if (
      event.target.value === "" ||
      (!isNaN(event.target.value) && event.target.value.match("^[^.]+$"))
    ) {
      if (action === "add") {
        setAddValue(event.target.value);
      } else {
        setInputvalue(event.target.value);
      }
    }
  };

  return (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <NavbarTop />
        <HeaderAdmin title=" Manage Flexible Individual Bet Time"></HeaderAdmin>
        <Row>
          <Col>
            <Table responsive>
              <thead>
                <tr>
                  <th>Day</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {plansDays.map(
                  (elem, index) =>
                    elem !== "0" && (
                      <tr key={index}>
                        <td className="inputLabel_style ">
                          <input
                            disabled={!(index === buttonIndex)}
                            value={index === buttonIndex ? inputValue : elem}
                            onChange={(e) => onChange(e, "update")}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <ButtonCustom
                            onClick={() =>
                              changeButton(
                                index,
                                index === buttonIndex ? "Update" : "Edit",
                                elem
                              )
                            }
                            title={index === buttonIndex ? "Update" : "Edit"}
                          />
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </Table>
          </Col>
          <Col>
            <div className="day_heading col">
              <h2 className="day_heading_title">Add Day</h2>
            </div>
            <InputInline
              label="Day"
              onClickUpdate={() => addnewDay()}
              onChange={(e) => onChange(e, "add")}
              value={addValue}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ManageTimeIndividual;
