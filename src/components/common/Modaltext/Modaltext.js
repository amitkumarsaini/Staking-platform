import React from 'react'
import './Modaltext.css'
import { Col } from 'react-bootstrap'


function Modaltext(props) {
    return (
        <>
            <Col className="modal_header">
                <p>{props.percentagelabel}
                    <Col className={`bold indicatorDiv ${props.percentage ? props.percentage > 0 ? "positive" : "negative" : ""}`}>{props.percentage}%</Col>
                </p>

                <h3 className="modal-heading">   <img className="heading-logo" src={props.logo} /> {props.heading}</h3>
                <p>{props.pricelabel}
                    <Col className="red-text">{props.pricevalue}</Col>
                </p>
            </Col>

        </>
    )
}

export default Modaltext
