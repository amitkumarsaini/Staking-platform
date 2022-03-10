import React from 'react'
import Card from 'react-bootstrap/Card'
import './Dashboardcard.css'
function Dashboardcard(props) {
    return (

        <div className={`dash-card ${props.cstyle}`}>
            <div className="dash-left">
                <h3>{props.heading}</h3>
                <h4>{props.subheading}</h4>
                <p>{props.stake}</p>

            </div>
            <div className="dash-right">
                <img src={props.stake_icon} alt="" />
            </div>
        </div>

    )
}

export default Dashboardcard
