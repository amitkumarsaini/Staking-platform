import React from 'react'
import {Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './LinkGroupStyle.css'

const LinkGroup = (props) => {


    return (

        <ul className="linkGroup_style" id="myID">
            <li className={`isActiveLeft ${props.cstyle}`}>
                <Link to={`/${props.leftLink}`}>{props.leftbtn_title} <img src={props.iconleft} /></Link>
            </li>
            <li className={`isActiveLeft ${props.cstyles}`}>
                <Link to={`/${props.rightLink}`}>{props.rightbtn_title} <img src={props.iconright} /></Link>
            </li>
        </ul>

    )
}

export default LinkGroup
