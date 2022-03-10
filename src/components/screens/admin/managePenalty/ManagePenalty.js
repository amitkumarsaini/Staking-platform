import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { INVERSE_ADDRESS, INVERSE_ADDRESS_BNB } from "../../../../constant";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import InputInline from "../../../common/InputInline/InputInline";
import "../managePenalty/ManagePenaltyStyle.css";
import NavbarTop from "../navbarTop/NavbarTop";
import InverseABI from "./../../../../assets/InverseABI.json";
import { ContractServices } from "../services/CommonServices";
import { setLoader } from "../actions/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../../Toast/Toast";

const ManagePenalty = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [penalty, setPenalty] = useState([]);
  const [days, setDays] = useState([]);
  const contractCase = useSelector((state) => state.admin_user.contract);
  let smartContractInverse;
  if (contractCase === "ETH") {
    smartContractInverse = INVERSE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = INVERSE_ADDRESS_BNB;
  }

  useEffect(() => {
    getPenalties();
  }, []);

  const getPenalties = async () => {
    try {
      dispatch(setLoader(true));
      setPenalty([]);

      const contract = await ContractServices.callContract(
        smartContractInverse,
        InverseABI
      );
      const result = await contract.methods.planDaysCounter().call();

      for (let i = 0; i < result; i++) {
        if (i >= 1) {
          let obj = [];
          let day = await contract.methods.planDaysIndexed(i).call();
          setDays((days) => [...days, day]);

          for (let j = 0; j < day; j++) {
            const penalty = await contract.methods.penalty(day, j).call();

            obj.push(penalty);
          }
          setPenalty((penalty) => [...penalty, obj]);
        }
      }
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const handleClick = async (category, index) => {
    try {
      if (value === "" || value < 0 || value > 100) {
        return toast.error("Enter a valid percentage");
      } else if (isNaN(value) && !value.match("^[^.]+$")) {
        return toast.error("Enter a valid percentage");
      } else {
        const owner = await ContractServices.isMetamaskInstalled();
        dispatch(setLoader(true));
        const gasPrice = await ContractServices.calculateGasPrice();
        const contract = await ContractServices.callContract(
          smartContractInverse,
          InverseABI
        );
        const gas = await contract.methods
          .setPenalty(Math.floor(value), index, category)
          .estimateGas({ from: owner });
        const result = await contract.methods
          .setPenalty(Math.floor(value), index, category)
          .send({ from: owner, gasPrice, gas });
        if (result.status) {
          await getPenalties();
        }
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <NavbarTop />
        <HeaderAdmin title="Manage Penalty" />

        <Container fluid>
          {penalty.map((element, index) => (
            <Row key={index}>
              <Col className="day_heading">
                {days[index] != 0 && (
                  <h2 className="day_heading_title">Plan Day {days[index]}</h2>
                )}

                {element.map((elem, i) => (
                  <div key={i} className="inputLabel_style row">
                    <label
                      htmlFor="formPlaintextEmail"
                      className="form-label col-form-label col-md-2 col-12"
                    >{`Day ${i + 1}`}</label>
                    <div className="col-sm-8">
                      <input
                        onChange={(e) => onChange(e)}
                        className="form-control"
                        defaultValue={elem}
                      />
                    </div>
                    <div className="col-sm-2">
                      <button
                        onClick={() => handleClick(days[index], i)}
                        type="button"
                        className="custom-btn undefined btn btn-primary"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          ))}
        </Container>
      </Container>
    </Container>
  );
};

export default ManagePenalty;
