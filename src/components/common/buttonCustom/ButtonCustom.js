import React from 'react'
import { Button } from 'react-bootstrap'
import './ButtonStyle.css'

const ButtonCustom = (props) => {
    return (
        <Button variant="primary" onClick={props.onClick} className={`custom-btn ${props.className}`} disabled={props.disabled}>{props.title}</Button>
    )
}
export default ButtonCustom
