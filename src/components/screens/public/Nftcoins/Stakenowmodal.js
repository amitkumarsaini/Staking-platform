import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'
import ButtonCustom from '../../../common/buttonCustom/ButtonCustom'
import Modaltext from '../../../common/Modaltext/Modaltext';
import { Col, Form, Row, Dropdown, Container, DropdownButton } from 'react-bootstrap'
import Slider from '@material-ui/core/Slider';
import _ from "lodash";
import Switch from "react-switch";
import { getTokenAllowanceInfo, getTokenAllowance, betFixed, betFlexible, getBalance, getWalletBalance, callContractMethod } from "../../../../redux/actions/ethereum.action";
import { useSelector, useDispatch } from "react-redux";
import { XIV, COIN_LIST, COIN_LIST_BNB } from "../../../../constant";
import { CommonService } from "../../../../services/CommonService";
import { toast } from "../../../Toast/Toast";
import { getTokenDecimals } from "../../../../redux/actions/ethereum.action"
import { BigNumber } from "bignumber.js";


let network = localStorage.getItem("network");
let MAIN_COIN_LIST = COIN_LIST;
if (network === "bnb") {
    MAIN_COIN_LIST = COIN_LIST_BNB
}
function Stakenowmodal(props) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    let array = []
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [allowance, setAllowance] = useState(false);
    const walletAddress = useSelector((state) => state.user.walletAddress);
    const platform = useSelector((state) => state.user.platform);
    const xiv_decimals = useSelector((state) => state.ethereum.xiv_decimals);
    const [risk, setRisk] = useState(0);
    const [rewards, setRewards] = useState(0);
    const [amount, setAmount] = useState();
    const [confirmed, setConfirmed] = useState(false);
    const [betDays, setBetDays] = useState(props.betDays[0]);
    const [dropValue, setDropValue] = useState();
    const [selectedToken, setToken] = useState(MAIN_COIN_LIST[0]);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [calculatedXIV, setCalculatedXIV] = useState(0);
    const [xivPrice, setXivPrice] = useState(0);
    const [tokenSupported, setTokenSupported] = useState(true);
    const [betFees, setBetFees] = useState(0);

    const handleChange = (e) => {
        const token = selectedToken;
        let data = {
            walletAddress,
            tokenAddress: token.address,
            status: !allowance
        }
        dispatch(getTokenAllowance(data)).then(async (res) => {
            if (res && res.status) {
                _getTokenAllowanceInfo();
            }
        }).catch((err) => {
        })
    }

    useEffect(async () => {
        if (walletAddress) {
            _getTokenAllowanceInfo();
            _getTokenBalance();
        }
    }, [selectedToken, walletAddress])

    useEffect(async () => {
        _calculateRewards();
    }, [amount, risk, dropValue])

    useEffect(async () => {
        if (show) {
            _getPriceInXIV();
        }
    }, [selectedToken, show, amount])

    useEffect(async () => {
        setAmount('');
        setConfirmed(false);
        if (show) {
            setToken(MAIN_COIN_LIST[0])
            setBetDays(props.betDays[0]);
            _getBetFees()
            console.log("props.selectedDropValue - ", props.selectedDropValue)
            if (props.selectedDropValue) {
                handleSliderChange('', parseInt(props.selectedDropValue))
            } else {
                handleSliderChange('', parseInt(props.flexiblePlans[0].drop))
            }
        }
    }, [show])


    const _getBetFees = async () => {
        await dispatch(callContractMethod('betFees', [], false)).then(async (betFees) => {
            setBetFees(betFees)
        })
    }


    const handleSliderChange = (event, newValue) => {
        const value = _.find(array, function (o) { return o.value === newValue; });
        setDropValue(newValue)
        setRisk(value.risk)
    }

    const _getPriceInXIV = async () => {
        console.log('_getPriceInXIV')
        if (selectedToken.address !== MAIN_COIN_LIST[0].address) {
            await dispatch(callContractMethod('getPriceInXIV', [selectedToken.address], false)).then(async (xiv) => {
                console.log("price -- ", xiv);
                if (xiv) {
                    setXivPrice(xiv)
                    let xiv_token = (xiv / xiv_decimals) * amount;
                    console.log("xiv_token -- ", xiv_token);
                    xiv_token = CommonService.fixedToDecimal(xiv_token);
                    setTokenSupported(true)
                    setCalculatedXIV(xiv_token);
                } else {
                    setCalculatedXIV(0);
                    setTokenSupported(false)
                }
            })
        } else {
            setXivPrice(xiv_decimals)
            setCalculatedXIV(amount);
            setTokenSupported(true)
        }
    }

    const _getTokenAllowanceInfo = async () => {
        if (selectedToken.type === 2) {
            let data = {
                walletAddress,
                tokenAddress: selectedToken.address
            }
            let allowance = await dispatch(getTokenAllowanceInfo(data));
            if (allowance > 0) {
                setAllowance(true)
            } else {
                setAllowance(false)
            }
        }
    }

    const _getTokenBalance = async () => {
        let tokenDecimals = 10 ** 18;
        let balance = 0;
        if (selectedToken.type === 2) {
            let data = {
                walletAddress,
                tokenAddress: selectedToken.address
            }
            balance = await dispatch(getBalance(data));
            tokenDecimals = await dispatch(getTokenDecimals(data));
        } else {
            let data = {
                walletAddress
            }
            balance = await dispatch(getWalletBalance(data));
        }
        console.log('balance - ', balance,)
        console.log('tokenDecimals - ', tokenDecimals,)
        balance = BigNumber(balance).div(BigNumber(tokenDecimals));
        console.log('balance - ', balance,)
        balance = await CommonService.fixedToDecimal(balance.toFixed());
        setTokenBalance(balance);
    }


    const setMarksList = () => {
        for (var i = 0; i < props.flexiblePlans.length; i++) {
            let item = props.flexiblePlans[i];
            if (item.isActive) {
                let temp = {
                    value: parseInt(item.drop),
                    label: (platform === 1 ? '-' : '') + item.drop + '%',
                    risk: item.risk,
                    reward: item.reward,
                    index: i
                }
                array.push(temp)
            }
        }
        array = _.orderBy(array, "value", "asc");

    }
    setMarksList();



    const doBetNow = async () => {
        if (!confirmed) return toast.error("Please confirm the amount first");

        console.log('tokenBalance - ', tokenBalance)
        console.log('amount - ', amount)
        if (parseFloat(tokenBalance) < parseFloat(amount)) return toast.error(`Sorry you have insufficient balance of ${selectedToken.name}`);

        const token = selectedToken;
        let data = {
            tokenAddress: token.address
        }
        let tokenDecimals = 10 ** 18;
        if (selectedToken.type === 2) {
            tokenDecimals = await dispatch(getTokenDecimals(data));
        }


        // if (parseInt(amount) < parseInt(props.miniBetAmount / xiv_decimals) || parseInt(amount) > parseInt(props.maxBetAmount / xiv_decimals)) return toast.error(`Please enter amount in range ${props.miniBetAmount / xiv_decimals} to ${parseInt(props.maxBetAmount / xiv_decimals)} ${selectedToken.name}`);

        let _amount = await CommonService.convertWithDecimal(amount, tokenDecimals);
        if (props.coin.planType == 1) {
            data = {
                amount: _amount,
                coinType: props.coin.coinType,
                coinAddress: props.coin.address,
                betToken: token.address,
                _isInverse: platform === 1 ? true : false,
                type: selectedToken.type,
                walletAddress
            }

            console.log("betFixed - ", data)
            dispatch(betFixed(data)).then(async (res) => {
                if (res && res.status) {
                    toast.success("Staked successfully");
                    handleClose();
                }
            })
        } else {
            const _dropValue = _.find(array, function (o) { return o.value === dropValue; });
            let _daysIndex = props.betDays.indexOf(betDays)
            data = {
                amount: _amount,
                coinType: props.coin.coinType,
                coinAddress: props.coin.address,
                betToken: token.address,
                index: _dropValue.index + 1,
                _daysIndex: _daysIndex + 1,
                _isInverse: platform === 1 ? true : false,
                type: selectedToken.type,
                walletAddress
            }
            dispatch(betFlexible(data)).then(async (res) => {
                if (res && res.status) {
                    toast.success("Staked successfully");
                    handleClose();
                }
            })
        }

    }

    const _setConfirmed = async () => {
        if (!confirmed && !amount) return toast.error("Please enter the amount first");
        setConfirmed(!confirmed)
    }

    const _calculateRewards = async () => {
        if (dropValue) {
            let _risk = props.planType === 1 ? props.fixedPlans?.reward : _.find(array, function (o) { return o.value === dropValue; }).reward;
            let rewards = (amount * _risk) / 100;
            rewards = (xivPrice / xiv_decimals) * rewards;
            rewards = CommonService.fixedToDecimal(rewards);
            setRewards(rewards)
        }
    }

    const _setAmount = async (value) => {
        if (!value || parseFloat(tokenBalance) >= parseFloat(value)) {
            setAmount(value)
        } else {
            toast.error("Sorry you have insufficient balance of " + selectedToken.name);
        }

    }
    return (
        <>


            <ButtonCustom onClick={handleShow} className="stake-btn " title="Stake now" />
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modaltext percentagelabel="24 hour Change :" percentage={props.coin.change24 ? props.coin.change24.toFixed(2) : 0} logo={props.coin.logo} heading={props.coin.symbol} pricelabel="Last price :" pricevalue={props.coin.freshPrice ? '$' + (props.coin.freshPrice / 10 ** 8).toFixed(2) : ''} />
                </Modal.Header>
                <Modal.Body>
                    <Container className="modal_body">
                        <Row>
                            <Col lg={6}>
                                <label>Token :</label>
                            </Col>
                            <Col lg={6} >
                                <Form className="token-col">
                                    <Form.Control
                                        type="text"
                                        value={amount}
                                        onChange={(e) => _setAmount(e.target.value)}
                                        disabled={confirmed}
                                    />
                                    <DropdownButton
                                        id="dropdown-basic"
                                        className="sort-btn token-drop"
                                        variant="outline"
                                        title={
                                            <div className="pull-left">
                                                <img width={20} className="coin-logo" src={selectedToken.logo} />
                                                {selectedToken.name}
                                            </div>
                                        }
                                        name="betDays"
                                        value={selectedToken}
                                        onSelect={(e) => {
                                            setToken(JSON.parse(e))
                                            setAmount('');
                                            setConfirmed(false);
                                        }
                                        }
                                    >
                                        {MAIN_COIN_LIST.map((item, index) => (
                                            <Dropdown.Item eventKey={JSON.stringify(item)}><img width={20} src={item.logo} /> {item.name}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                    <ButtonCustom title={confirmed ? "Reset Amount" : "Confirm Amount"} className="stake-btn confirm-btn" onClick={() => _setConfirmed()} />

                                </Form>
                                <label className="xiv_range">{selectedToken.address !== MAIN_COIN_LIST[0].address ? tokenSupported ? calculatedXIV + 'XIV' : "Token not supported" : ''}<br />{CommonService.fixedToDecimal(BigNumber(props.miniBetAmount).div(xiv_decimals))} to {CommonService.fixedToDecimal(BigNumber(props.maxBetAmount).div(xiv_decimals))} XIV</label>
                                <label className="xiv_range balance_info">Balance : {tokenBalance} {selectedToken.name}</label>

                            </Col>
                        </Row>
                        <Row className="mt-20">
                            <Col lg={6}>
                                <label>Risk :</label>
                            </Col>
                            <Col lg={6}>
                                <Form className="token-col">
                                    <p className="dark-text ">{props.planType === 1 ? props.fixedPlans?.risk : risk}%</p>

                                </Form>
                            </Col>
                        </Row>
                        <Row className="mt-20">
                            <Col lg={6}>
                                <label>{platform === 1 ? 'Drop Value' : 'Rise Value'} :</label>
                            </Col>
                            <Col lg={6}>
                                <Form className="token-col">
                                    <p className="dark-text bold">{props.planType === 1 ? props.fixedPlans?.drop + '%' : <div className="range-wrap">
                                        {array.length && dropValue ? <Slider
                                            aria-labelledby="discrete-slider-restrict"
                                            step={null}
                                            valueLabelDisplay="auto"
                                            value={dropValue}
                                            marks={array}
                                            min={array[0].value}
                                            max={array[array.length - 1].value}
                                            onChange={handleSliderChange}
                                        /> : ""}
                                    </div>}</p>

                                </Form>
                            </Col>
                        </Row>
                        <Row className="mt-20">
                            <Col lg={6}>
                                <label>Vault Fee :</label>
                            </Col>
                            <Col lg={6}>
                                <Form className="token-col">
                                    <p className="dark-text ">{betFees}%</p>

                                </Form>

                            </Col>
                        </Row>
                        <Row className="mt-20">
                            <Col lg={6}>
                                <label>Return :</label>
                            </Col>
                            <Col lg={6}>
                                {amount ? <>
                                    <Row className="dark-text "> {<Col lg={12}>
                                        Principal :
                                        {(amount - (amount * betFees) / 100).toFixed(2)}
                                        <img width={20} className="coin-logo ml-5" src={selectedToken.logo} />
                                        {selectedToken.name}
                                       &nbsp; +&nbsp;
                                        Reward :
                                        {(rewards - (rewards * betFees) / 100).toFixed(2)}
                                        <img width={20} className="coin-logo ml-5" src={MAIN_COIN_LIST[0].logo} />
                                        {MAIN_COIN_LIST[0].name}
                                    </Col>} </Row>
                                </> :
                                    <p className="dark-text ">0 </p>}
                            </Col>
                        </Row>
                        <Row className="mt-20">
                            <Col lg={6}>
                                <label>Time :</label>
                            </Col>
                            <Col lg={6}>
                                <Form className="token-col">
                                    <DropdownButton
                                        id="dropdown-basic"
                                        className="defi-drop sort-btn"
                                        title={props.coin.planType === 1 ? `6 hrs` : betDays == 1 ? `24 hrs` : `${betDays} days`}
                                        name="betDays"
                                        variant="outline"
                                        value={betDays}
                                        onSelect={(e) => {
                                            setBetDays(e)
                                        }
                                        }
                                    >
                                        {props.coin.planType === 1 ? props.betDays.map((item, index) => (
                                            <Dropdown.Item eventKey={item}>6 hrs</Dropdown.Item>
                                        )) : props.betDays.map((item, index) => (
                                            <Dropdown.Item eventKey={item}>{item == 1 ? `24 hrs` : `${item} days`}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </Form>
                            </Col>
                        </Row>
                        {selectedToken.type === 2 ? <Row className="mt-20">
                            <Col lg={6}>
                                <label>Allow to Access {selectedToken.name} :</label>
                            </Col>
                            <Col lg={6}>
                                <Form className="token-col">
                                    <Switch
                                        onChange={(e) => handleChange(e)}
                                        checked={allowance}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                    />
                                </Form>
                            </Col>
                        </Row> : ''}
                        <Row className="mt-20">
                        </Row>
                        <Row className="">
                            <Col lg={12} className="text-center ">
                                <ButtonCustom title="Stake Now" className="stake-btn" onClick={doBetNow} disabled={selectedToken.type === 2 ? !allowance : false} />
                                <p className="dark-text mt-20 title-line"></p>
                            </Col>
                        </Row>
                        <div className="terms-condition">
                            <h5>Terms and conditions</h5>
                            <p>
                                These terms of service, and additional terms they expressly incorporate by reference (collectively, the “Terms”) tell you the terms and conditions on which you may make use of the website / platforms <a href="https://projectinverse.com/">https://projectinverse.com/</a> and any of their subdomains (collectively, the “site / platform”) and the services provided through the site / platform (the “services”). Use of the site / platform includes accessing, browsing, staking, swapping, or contributing to Liquidity Pool.


                            </p>
                        </div>

                    </Container>

                </Modal.Body>

            </Modal >
        </>
    )
}

export default Stakenowmodal
