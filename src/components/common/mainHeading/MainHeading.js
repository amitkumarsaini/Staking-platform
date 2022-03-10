import React from 'react'
import {Container, Col, Row} from 'react-bootstrap';
import './MainHeading.css'

function MainHeading(props) {
    return (
        <Container fluid>
            <Col className="common-heading">
                <Row>
                    <Col md={8}> <h3 className="title_style"><span>{props.title}</span> {props.children}</h3>
                        {props.subtitle ? <p>{props.subtitle}</p> : null}
                    </Col>
                    <Col md={4}>
                        {props.text ? <p className="right-text">{props.text}</p> : null}
                    </Col>
                </Row>
            </Col >
        </Container>
    )
}

export default MainHeading
