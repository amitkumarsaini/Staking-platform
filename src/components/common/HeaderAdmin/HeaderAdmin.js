import React from 'react'
import { Row, Col } from 'react-bootstrap'
import './headerAdminStyle.css'

const HeaderAdmin = (props) => {
    return (
        <Row className="headerAdmin__Style">
            <Col><h2>{props.title}</h2></Col>
            <Col style={{textAlign:'right', marginBottom:'15px'}}>{props.children}</Col>
        </Row>
       
       
    )
}

export default HeaderAdmin
