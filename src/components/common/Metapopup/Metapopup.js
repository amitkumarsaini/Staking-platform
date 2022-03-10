import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Navbar, Nav, Container, NavDropdown, Form } from "react-bootstrap";
import metamask from "../../../theme/images/metamask.png";
import trust_wallet from "../../../theme/images/trust_wallet.png"
import "./Metapopup.scss";
import {
  connectmetamask,
  disconnectWallet,
  connectTrustWallet
} from "../../../redux/actions/user.action";
import { useSelector, useDispatch } from "react-redux";
import connect from "../../../theme/images/connect.png";
import copy from "../../../theme/images/copy.png";
function Metapopup() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const wallet = useSelector((state) => state.user.wallet);
  useEffect(async () => {
    setShow(false);
  }, [walletAddress]);
  return (
    <>
      {!walletAddress ? (
        <Button
          variant="primary"
          className="connect-wallet"
          onClick={handleShow}
        >
          Connect Wallet
        </Button>
      ) : (
        <Button
          variant="primary"
          className="connect-wallet"
          onClick={handleShow}
        >
          <span className="wallet-add">{walletAddress} </span>
          <span className="">Disconnect Wallet </span>
        </Button>
      )}

      <div className="homepopup">
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-home modal-meta"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Connect Wallet
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className=" meta-popup">
            <h3> Choose Your Wallet</h3>
            {walletAddress ? (
              <div className="meta-address">
                <img src={copy} className="copy-icon" /> {walletAddress}
              </div>
            ) : (
              ""
            )}
            <div className="wallet-col">
              <div
                className={`meta-btn ${wallet === "MetaMask" ? "active-wallet" : ""}`}
                onClick={() => dispatch(connectmetamask())}
              >
                <img src={metamask} />
                <span className="meta-text">Metamask</span>
              </div>
              <div
                className={`meta-btn ${wallet === "TrustWallet" ? "active-wallet" : ""}`}
                onClick={() => dispatch(connectTrustWallet())}
              >
                <img src={trust_wallet} />
                <span className="meta-text">Trust Wallet</span>
              </div>
              <div className="meta-btn">
                {/* <img src={wallet} /> */}
                <span className="meta-text">
                  <img src={connect} /> More wallet coming soon
                </span>
              </div>
            </div>

            <div
              className="text-center"
              onClick={() => dispatch(disconnectWallet())}
            >
              <button className="disconnect-wallet btn">
                Disconnect Wallet
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Metapopup;
