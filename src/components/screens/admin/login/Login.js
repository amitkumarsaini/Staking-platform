import React, { useState } from "react";
import { Col, Container, Button, Form } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import logo from "../../../../theme/images/inverse_logo.svg";
import "./LoginStyle.css";
import metaMaskLogo from "../../../../theme/images/metamask.png";
import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import { changeNetwork, checkOwner } from "./../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { ContractServices } from "../services/CommonServices";
import { rootName } from "../../../../constant";

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [addMetaAddress, setaddMetaAddress] = useState("");
  const [address, setAddress] = useState(false);
  const oracleType = useSelector((state) => state.admin_user.contract);

  const onLoginHandler = async () => {
    showAddress();
    dispatch(checkOwner());
  };

  const showAddress = async () => {
    setAddress(true);
    setaddMetaAddress(await ContractServices.isMetamaskInstalled());
  };

  const { from } = location.state || {
    from: { pathname: `${rootName}/admin/dashboard` },
  };

  const onChange = (e) => {
    dispatch(changeNetwork(e.target.value));
  };

  const logged = useSelector((state) => state.admin_user.isLoggedIn);
  if (logged) {
    return <Redirect to={from} />;
  }

  return (
    <Container fluid className="d-center">
      <div className="login_screen">
        <div className="login_form text-center">
          <div className="text-center">
            <img
              alt="logo"
              className="logo"
              style={{ marginBottom: "25px" }}
              src={logo}
            />
          </div>
          {/* <Form.Group as="Row" className="d-flex row">
            <Form.Label column sm="4">
              Choose oracle type :
            </Form.Label>
            <Col sm="8">
              <div className="inputLabel_style">
                <Form.Control
                  as="select"
                  value={oracleType}
                  onChange={(e) => onChange(e, "oracleType")}
                >
                  <option className="selct" value="ETH">
                    Ethereum
                  </option>
                  <option className="selct" value="BNB">
                    Binance
                  </option>
                </Form.Control>
              </div>
            </Col>
          </Form.Group> */}
          {address ? (
            <input
              type="text"
              value={addMetaAddress}
              className="loginInput_style"
              readOnly
            />
          ) : (
            <div className="text-center">
              <Button
                onClick={() => showAddress()}
                className="btn_connect_metamask"
                to="#!"
              >
                <img alt="logo" src={metaMaskLogo} /> Connect to admin MetaMask
              </Button>
            </div>
          )}
          <div className="text-center">
            <ButtonCustom
              onClick={() => onLoginHandler()}
              className="btnLogin_style"
              title="Login"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
