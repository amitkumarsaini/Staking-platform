import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap/'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Swapcard.css';
import { toast } from "../../Toast/Toast";

function Swapcard(props) {
    return (
        <div>
            <Card className={`swap-card ${props.cstyle}`}>
                <Card.Body>
                    <Col className="swap-body">
                        <Row>
                            <Col className="swap-col">
                                <h4>{props.title}</h4>
                                <img src={props.swap_icon} alt="" />
                            </Col>
                            <Col className="swap-text">
                                <Row>
                                    <Col>
                                        <p>{props.text} </p>
                                        <span className="cont_add">{props.cont_add}</span>
                                        <Col className="cont-code"><p>{props.code} </p>
                                            <CopyToClipboard text={props.code}
                                                onCopy={() => toast.success("Copied to clipboard")}>
                                                <span className="copyicon"><img src={props.copy_icon} /></span>
                                            </CopyToClipboard>


                                        </Col>
                                    </Col>
                                    <Col className="swapBtnWrap">
                                        <Button variant="primary" onClick={(e) => window.open(props.to)} className="swap-btn">{props.swap_btn}</Button>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </Col>
                </Card.Body>
            </Card>
        </div >
    )
}

export default Swapcard
