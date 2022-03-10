import React from "react";
import { Navbar, Container, Col, Nav } from "react-bootstrap";
import inverse_logo from "../../../../theme/images/inverse_logo.svg";
import "./NavbarStyle.css";
import { adminLogOut } from "./../actions/user";
import { useDispatch } from "react-redux";

const NavbarTop = (props) => {
  const dispatch = useDispatch();
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">
          <img src={inverse_logo} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Col className="navigation_Links">
          <Nav>
            <Nav.Link
              onClick={() => dispatch(adminLogOut())}
              eventKey={2}
              className="connectWallet_btn"
              href="#"
            >
              Logout
            </Nav.Link>
          </Nav>
          {/* </Navbar.Collapse> */}
        </Col>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
