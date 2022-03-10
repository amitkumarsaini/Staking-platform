import React, { useEffect, useState } from "react";
import { Navbar, Container, Col, Nav, Dropdown, DropdownButton } from "react-bootstrap";
import "./NavbarStyle.css";
import ethicon from '../../../theme/images/ethereum-icon.webp'
import bnbicon from '../../../theme/images/bnbicon.svg'
import { useSelector, useDispatch } from "react-redux";
import { NETWORK } from "../../../redux/constant/actionTypes";
import Metapopup from "../Metapopup/Metapopup";
import { setUserTheme } from "../../../redux/actions/user.action";

const NavbarTop = (props) => {
  const [day, setDay] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);

  useEffect(async () => {
    if (theme === "light") {
      setDay(true);
      document.body.classList.add("light-theme");
      return;
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme])

  const networkChange = async (e) => {
    localStorage.setItem("network", e);
    window.location.reload();
  }

  async function toggleTheme() {
    let _theme = theme === 'dark' ? 'light' : 'dark'
    dispatch(setUserTheme(_theme));
  }
  let network = localStorage.getItem("network");
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home" className="logo">
          {/* <img src={inverse_logo} /> */}
        </Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
        <Col className="navigation_Links">
          <div className="custom-control custom-switch">
            <input type="checkbox" id="custom-switch-theme" className="custom-control-input" checked={theme === "light"} />
            <label title="" for="custom-switch-theme" className="custom-control-label" onClick={toggleTheme}></label>
          </div>
          <div>
            <DropdownButton id="dropdown-basic-button" className="sort-btn top-dropdown"
              variant="outline"
              title={
                <div className="pull-left">
                  <img width={20} className="coin-logo" src={network === "bnb" ? bnbicon : ethicon} />
                  {network === "bnb" ? "Binance" : "Ethereum"}
                </div>
              }
              onSelect={(e) => {
                networkChange(e)
              }}
            >
              {network === "bnb" ?
                // <Dropdown.Item eventKey='eth'><img width={20} className="coin-logo" src={ethicon} /> Ethereum</Dropdown.Item>
                ''
                :
                <Dropdown.Item eventKey='bnb'><img width={20} className="coin-logo" src={bnbicon} /> Binance</Dropdown.Item>
              }
            </DropdownButton>
            <Nav.Link href="#deets" className="notification_btn">



              {props.connectWallet && (
                <Col className="thanks_msg">
                  <p>
                    Thank you for connecting to the wallet. Now you can use all
                    the functions.
                  </p>
                </Col>
              )}
            </Nav.Link>
          </div>
          <Navbar.Collapse
            style={{ flexGrow: "initial" }}
            id="responsive-navbar-nav"
          >
            <Nav>
              {!props.connectWallet ? (
                <Nav.Link
                  eventKey={2}
                  className="connectWallet_btn"
                  href="#"
                >
                  <Metapopup />
                </Nav.Link>
              ) : (
                <Nav.Link
                  eventKey={2}
                  className="disconnectWallet_btn"
                  href="#"
                >
                  <span className="disconnectTextStyle"></span>{" "}
                  Disconnect Wallet
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
