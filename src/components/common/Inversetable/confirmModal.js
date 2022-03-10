import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'
import ButtonCustom from '../buttonCustom/ButtonCustom'
import { Col, Form, Row, Dropdown, Container, DropdownButton } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { callContractMethod } from "../../../redux/actions/ethereum.action";

function ConfirmModal(props) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [penalty, setPenalty] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




    useEffect(async () => {
        if (show) {
            let days = await getPlentyPercentageIndex(props.bet.startTime);
            let betDayIndex = props.bet.planDays;

            console.log('days --- ', days)
            console.log('betDayIndex --- ', betDayIndex)

            await dispatch(callContractMethod('penalty', [betDayIndex, days], false)).then(async (penalty) => {
                setPenalty(penalty)
            })
        }
    }, [show])

    const getPlentyPercentageIndex = (betTime) => {
        let data = new Date(betTime * 1000);
        betTime = moment.utc(data)
        let leftDays = moment.duration(moment().diff(betTime))
        let days = parseInt(leftDays.asDays())
        if (days) {
            return days;
        } else {
            return 0;
        }
    }
    return (
        <>
            {!moment().isBefore(props.bet.endTime) && props.bet.plandata[0].status === 0 ? <ButtonCustom onClick={handleShow} className="stake-btn " title="Unstake now" /> : ''}
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Col className="modal_header">
                        <h3 className="modal-heading">  Confirm</h3>
                    </Col>                </Modal.Header>
                <Modal.Body>
                    <Container className="modal_body">
                        <span className="red-text">  You staked &nbsp;
                            {props.bet.plandata.length ? parseInt(props.bet.plandata[0].amount) / props.bet.tokenDecimals : ''} <img width={20} src={props.bet.tokenInfo?.logo} /> {props.bet.tokenInfo?.name}
                           &nbsp;  in this bet. Bet penalty will be {penalty}% ({parseInt(props.bet.plandata[0].amount) / props.bet.tokenDecimals * parseFloat(penalty) / 100} <img width={20} src={props.bet.tokenInfo?.logo} />
                            {props.bet.tokenInfo?.name}) if you unstake now.
                        </span>
                    </Container>
                    <Row className="mt-5">
                        <Col lg={12} className="text-center ">
                            <ButtonCustom title="Confirm" className="stake-btn" onClick={() => props._betPenalty(props.bet.betIndex)} />
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal >
        </>
    )
}

export default ConfirmModal;
