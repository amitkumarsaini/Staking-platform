import React from 'react'
import {Link} from 'react-router-dom';
import './Inversestakingcard.css'
function Inversestakingcard(props) {
    return (
        <>

            <div className={`defi-card ${props.cstyle}`}>{props.defilinks}</div>


        </>
    )
}

export default Inversestakingcard
