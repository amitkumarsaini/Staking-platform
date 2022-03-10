import React from 'react'
import {Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './LinkGroupStyle.css'

const LinkGroup = (props) => {


    return (
        <>
            <ul className="linkGroup_style" id="myID">
                <li className={`isActiveLeft ${props.activeTab === "stake" ? 'liquidity-tab' : ''}`} onClick={() => props.setActiveTab('stake')}>
                    <a>{props.leftbtn_title} <img src={props.iconleft} /></a>
                </li>
                <li className={`isActiveLeft ${props.activeTab !== "stake" ? 'liquidity-tab' : ''}`} onClick={() => props.setActiveTab('unStake')}>
                    <a >{props.rightbtn_title} <img src={props.iconright} /></a>
                </li>
            </ul>
        </ >
    )
}

export default LinkGroup