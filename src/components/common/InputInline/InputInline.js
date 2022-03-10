import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import ButtonCustom from "../buttonCustom/ButtonCustom";

const InputInline = (props) => {
  return (
    <Form.Group
      as={Row}
      className="inputLabel_style"
      controlId="formPlaintextEmail"
    >
      <Form.Label column xs="12" md="2">
        {props.label}
      </Form.Label>
      <Col sm="8">
        <Form.Control
          value={props.value}
          disabled={props.disabled}
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
      </Col>
      {!props.show && (
        <Col sm="2">
          <ButtonCustom title="Update" onClick={props.onClickUpdate} />
        </Col>
      )}
    </Form.Group>
  );
};

export default InputInline;
