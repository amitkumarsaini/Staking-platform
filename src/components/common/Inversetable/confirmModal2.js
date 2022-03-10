import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'
import ButtonCustom from '../buttonCustom/ButtonCustom'
import { Col, Form, Row, Dropdown, Container, DropdownButton } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux";
import close from '../../../theme/images/sidebar_close.svg'

function ConfirmModal(props) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(async () => {
        if (show) {

        }
    }, [show])

    return (
        <><span className="clear_all" onClick={handleShow}><img width={25} src={close} /></span>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Col className="modal_header">
                        <h3 className="modal-heading">  Confirm</h3>
                    </Col>                </Modal.Header>
                <Modal.Body>
                    <Container className="modal_body">
                        <span className="red-text"> Are you sure you want to remove this bet from list? </span>
                    </Container>
                    <Row className="mt-5">
                        <Col lg={12} className="text-center ">
                            <ButtonCustom title="Confirm" className="stake-btn" />
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal >
        </>
    )
}

export default ConfirmModal;
