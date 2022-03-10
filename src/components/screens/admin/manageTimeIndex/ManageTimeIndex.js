import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import NavbarTop from "../navbarTop/NavbarTop";

const ManageTimeIndex = () => {
  return (
    <Container fluid className="contentWrapper_main">
      <Container className="table_style" fluid>
        <NavbarTop />
        <HeaderAdmin title="Manage Flexible Individual Bet Time">
          <ButtonCustom title="Add Currency" />
        </HeaderAdmin>
        <Row>
          <Col>Manage Time Index</Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ManageTimeIndex;
