import React from 'react'
import {Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Platformheading.css'
function Platformheading(props) {
    return (
        <Col>
            <h2 className={` ${props.cstyle}`}><span className="heading-icon"><img src={props.tableicon} /></span>{props.tableheading}
                <Link className="detail_btnStyle" to="/">Detail</Link></h2>
        </Col>
    )
}

export default Platformheading
