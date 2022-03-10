import React from 'react'
import { Col } from 'react-bootstrap'

function Tableheading(props) {
    return (
        <Col>
            <h2 className={` ${props.cstyle}`}><span className="heading-icon"><img src={props.tableicon} /></span>{props.tableheading}</h2>
        </Col>
    )
}

export default Tableheading
