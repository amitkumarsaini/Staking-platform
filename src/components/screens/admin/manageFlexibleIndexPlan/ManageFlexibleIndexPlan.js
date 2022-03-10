import React from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import NavbarTop from '../navbarTop/NavbarTop'

const ManageFlexibleIndexPlan = () => {
    return (
        <Container fluid className="contentWrapper_main">
        <Container className="table_style" fluid>
         <NavbarTop />
            <Row>
                <Col>Manage Flexible Index Plan</Col>
            </Row>
        </Container>
        </Container>
    )
}

export default ManageFlexibleIndexPlan
