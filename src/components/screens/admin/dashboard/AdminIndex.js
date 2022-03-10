import React, { Fragment, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { adminLogOut } from "../actions/user";
import NavbarTop from "../navbarTop/NavbarTop";
import Currencies from "./Currencies";

const AdminIndex = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const { ethereum } = window;
    ethereum.on("accountsChanged", (account) => {
      dispatch(adminLogOut());
    });
  }, []);
  return (
    <Fragment>
      <Container fluid className="contentWrapper_main">
        <NavbarTop />
        <Col className="contentWrapper">
          <Currencies />
        </Col>
        <Col className="footer_container">
          <p> Copyright © 2021 Inverse. All rights reserved.</p>
        </Col>
      </Container>
    </Fragment>
  );
};

export default AdminIndex;
