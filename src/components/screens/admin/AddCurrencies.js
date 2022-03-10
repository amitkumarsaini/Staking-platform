import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import {
  ORACLE_ADDRESS,
  ORACLE_ADDRESS_BNB,
  USDT_ADDRESS_BNB,
  USDT_ADDRESS_ETH,
} from "../../../constant";
import ButtonCustom from "../../common/buttonCustom/ButtonCustom";
import HeaderAdmin from "../../common/HeaderAdmin/HeaderAdmin";
import InputInline from "../../common/InputInline/InputInline";
import { toast } from "../../Toast/Toast";
import { setLoader } from "./actions/utils";
import { ContractServices } from "./services/CommonServices";
import OracleABI from "./../../../assets/OracleABI.json";
import { addCurrency, editCoinToOracle } from "./actions/coins";
import { useDispatch, useSelector } from "react-redux";

const AddCurrencies = ({
  resetComponent,
  coin,
  type,
  plan,
  index,
  currentComponent,
  action,
}) => {
  const contractCase = useSelector((state) => state.admin_user.contract);
  let smartContractInverse;
  if (contractCase === "ETH") {
    smartContractInverse = ORACLE_ADDRESS;
  } else if (contractCase === "BNB") {
    smartContractInverse = ORACLE_ADDRESS_BNB;
  }
  const [formData, setFormData] = useState({
    oracleType: "",
    symbol: "",
    oracleAddress: "",
  });
  const [contractAddress, setContractAddress] = useState("");
  const [label, changeLabel] = useState(false);
  const [disable, setDisable] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (action === "Edit") {
      editCoinDetails();
      setContractAddress(currentComponent.address);
    }
  }, []);

  const editCoinDetails = async () => {
    try {
      dispatch(setLoader(true));
      const contract = await ContractServices.callContract(
        smartContractInverse,
        OracleABI
      );

      const { oracleAddress } = await contract.methods
        .coin(currentComponent.address)
        .call();

      if (currentComponent.oracleType === "2") {
        changeLabel(true);
        setDisable(true);
      } else {
        changeLabel(false);
      }

      setFormData({
        ...formData,
        oracleType: currentComponent.oracleType,
        symbol: currentComponent.symbol,
        oracleAddress: oracleAddress,
      });
      dispatch(setLoader(false));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const { oracleType, symbol, oracleAddress } = formData;

  const onChange = async (e, name) => {
    let usdt;
    if (contractCase === "ETH") {
      smartContractInverse = ORACLE_ADDRESS;
      usdt = USDT_ADDRESS_ETH;
    } else if (contractCase === "BNB") {
      smartContractInverse = ORACLE_ADDRESS_BNB;
      usdt = USDT_ADDRESS_BNB;
    }
    setFormData({ ...formData, [name]: e.target.value });
    if (name === "oracleType" && e.target.value === "2") {
      changeLabel(true);
      setDisable(true);
      setFormData({ ...formData, [name]: e.target.value, oracleAddress: usdt });
    } else if (name === "oracleType") {
      changeLabel(false);
      setDisable(false);
      setFormData({ ...formData, [name]: e.target.value, oracleAddress: "" });
    }
  };

  const addCoin = () => {
    if (action === "Add" && symbol !== "") {
      dispatch(
        addCurrency(
          contractAddress,
          symbol,
          oracleAddress,
          coin,
          type,
          oracleType,
          resetComponent
        )
      );
    } else if (action === "Edit" && symbol !== "") {
      dispatch(
        editCoinToOracle(
          oracleAddress,
          resetComponent,
          currentComponent,
          oracleType,
          contractAddress,
          symbol
        )
      );
    } else {
      return toast.error("Invalid coin address");
    }
  };

  const handleChangeContractAddress = async (e) => {
    try {
      setContractAddress(e.target.value);
      if (e.target.value !== "") {
        let result = await ContractServices.getTokenSymbol(e.target.value);
        if (result === "0x0000000000000000000000000000000000000001") {
          result = contractCase;
        }
        if (!result.startsWith("Error: Provided address")) {
          setFormData({ ...formData, symbol: result });
        }
      } else {
        setFormData({ ...formData, symbol: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <HeaderAdmin title={`${action} Currencies`} />
        <Container fluid>
          <Row>
            <Form>
              <Form.Group as="Row" className="d-flex">
                <Form.Label column sm="2">
                  Choose oracle type :
                </Form.Label>
                <Col sm="8">
                  <div className="inputLabel_style">
                    <Form.Control
                      as="select"
                      value={oracleType}
                      onChange={(e) => onChange(e, "oracleType")}
                    >
                      <option className="selct" value="">
                        Select oracle type
                      </option>
                      <option className="selct" value="1">
                        Chainlink
                      </option>
                      <option className="selct" value="2">
                        Uniswap
                      </option>
                    </Form.Control>
                  </div>
                </Col>
              </Form.Group>

              <InputInline
                show={true}
                value={contractAddress}
                label="Contract Address"
                disabled={action === "Edit"}
                onChange={(e) => handleChangeContractAddress(e)}
              />

              <InputInline
                show={true}
                value={oracleAddress}
                disabled={disable}
                label={label ? "Pair Address" : "Oracle Address"}
                onChange={(e) => onChange(e, "oracleAddress")}
              />

              <InputInline
                show={true}
                value={symbol}
                label="Symbol"
                disabled={true}
                onChange={(e) => onChange(e, "symbol")}
              />
              <ButtonCustom onClick={resetComponent()} title="Cancel" />
              <ButtonCustom onClick={() => addCoin()} title="Submit" />
            </Form>
          </Row>
        </Container>
      </Container>
    </Container>
  );
};

export default AddCurrencies;
