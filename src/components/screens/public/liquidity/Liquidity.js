import React, { useEffect, useState } from "react";
import Wrapper from '../../../common/wrapper/Wrapper'
import ButtonCustom from '../../../common/buttonCustom/ButtonCustom';
import MainHeading from '../../../common/mainHeading/MainHeading';
import './LiquidityStyle.css';
import LinkGroup from '../../../common/linkGroup/LinkGroup2';
import { Link } from 'react-router-dom';
import addLiquidity from '../../../../theme/images/addLiquidity.svg'
import removeLiquidity from '../../../../theme/images/removeLiquidity.svg'
import {
  Container, Row, Col, Form,
  OverlayTrigger, Popover, Card, Tooltip
} from "react-bootstrap";
import pool_available_icon from '../../../../theme/images/pool_available_icon.svg'
import pool_locked_icon from '../../../../theme/images/pool_locked_icon.svg'
import pool_reward from '../../../../theme/images/pool_reward.svg'
import Switch from "react-switch";
import { useSelector, useDispatch } from "react-redux";
import { getTokenAllowanceInfo, getTokenAllowance, stakeTokens, unStakeTokens, callContractMethod, getBalance, claimRewards } from "../../../../redux/actions/ethereum.action";
import { XIV, XIV_BNB } from "../../../../constant";
import { CommonService } from "../../../../services/CommonService";
import { toast } from "../../../Toast/Toast";
import { XIV_DECIMALS } from "../../../../redux/constant/actionTypes";
import { BigNumber } from "bignumber.js";

const Liquidity = () => {
  const dispatch = useDispatch();
  const [allowance, setAllowance] = useState(false);
  const [amount, setAmount] = useState();
  const [activeTab, setActiveTab] = useState('stake');
  const [stakeDetails, setStakeDetails] = useState({});
  const [miniStakeAmount, setMiniStakeAmount] = useState(0);
  const [amountToUnlock, setAmountToUnlock] = useState(0);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const xiv_decimals = useSelector((state) => state.ethereum.xiv_decimals);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [gainLoss, setGainLoss] = useState(0);

  const handleChange = async (e) => {
    let network = await localStorage.getItem("network");

    let data = {
      walletAddress,
      tokenAddress: network === "bnb" ? XIV_BNB : XIV,
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
    document.body.className += " redactive";
    if (walletAddress) {
      _getTokenAllowanceInfo();
      _getStakedTokenInfo();
      _getTokenBalance();
      // _getRewards();
    }
  }, [walletAddress])

  useEffect(async () => {
    setAmount('');
  }, [activeTab])

  const _getStakedTokenInfo = async () => {
    dispatch(callContractMethod('stakeDetails', [walletAddress])).then((res) => {
      dispatch(callContractMethod('getRewards', [walletAddress])).then((rewards) => {
        console.log('rewards     -- ', rewards)
        console.log('res     -- ', res)
        if (rewards && res) {
          let _gainLoss = BigNumber(BigNumber(rewards[0]).plus(BigNumber(res.profit))).minus(BigNumber(rewards[1]).plus(BigNumber(res.losses)));
          _gainLoss = BigNumber(_gainLoss).div(xiv_decimals);
          res.pool_rewards = _gainLoss.toFixed(2)
          setStakeDetails(res)
          dispatch(callContractMethod('amountToUnlock', [walletAddress])).then((amountToUnlock) => {
            let available = parseInt(res?.stakeResidual) + parseInt(amountToUnlock[0]);
            if (_gainLoss < 0) {
              available = BigNumber(BigNumber(available).plus(BigNumber(rewards[0]).plus(parseInt(res.profit)))).minus(BigNumber(rewards[1]).plus(BigNumber(res.losses)))
            }
            available = BigNumber(available).div(xiv_decimals).toFixed()
            available = CommonService.fixedToDecimal(available)
            if (amountToUnlock) {
              setAmountToUnlock(available)
            }

          })
        }
      })

    })

    dispatch(callContractMethod('miniStakeAmount')).then((res) => {
      setMiniStakeAmount(res)
    })


  }

  const _getTokenAllowanceInfo = async () => {
    let network = await localStorage.getItem("network");
    let data = {
      walletAddress,
      tokenAddress: network === "bnb" ? XIV_BNB : XIV
    }
    let allowance = await dispatch(getTokenAllowanceInfo(data));
    if (allowance > 0) {
      setAllowance(true)
    } else {
      setAllowance(false)
    }
  }

  const _getTokenBalance = async () => {

    let network = await localStorage.getItem("network");

    let data = {
      walletAddress,
      tokenAddress: network === "bnb" ? XIV_BNB : XIV
    }
    let balance = await dispatch(getBalance(data));
    if (balance && xiv_decimals) {
      balance = BigNumber(balance).div(BigNumber(xiv_decimals));
      setTokenBalance(balance.toFixed());
    }
  }

  const _getRewards = async () => {
    dispatch(callContractMethod('getRewards', [walletAddress])).then((rewards) => {
      console.log('rewards     -- ', rewards)
      let _gainLoss = parseInt(rewards[0]) - parseInt(rewards[1]);
      _gainLoss = CommonService.fixedToDecimal(BigNumber(_gainLoss).div(xiv_decimals));
      setGainLoss(_gainLoss)
    })
  }


  const doStake = async () => {

    if (!amount) return toast.error("Please enter the amount first");
    console.log('tokenBalance  - ', tokenBalance)
    console.log('amount  - ', amount)
    if (parseFloat(tokenBalance) < parseFloat(amount)) return toast.error(`Sorry you have insufficient balance of XIV`);

    let _amount = await CommonService.convertWithDecimal(amount, xiv_decimals);
    console.log('_amount ', _amount)
    console.log('miniStakeAmount ', miniStakeAmount)
    if (parseFloat(_amount) < parseFloat(miniStakeAmount)) return toast.error(`Please enter minium amount ${BigNumber(miniStakeAmount).div(xiv_decimals).toFixed()} XIV`);
    let data = {
      amount: _amount,
      walletAddress
    }
    dispatch(stakeTokens(data)).then(async (res) => {
      if (res && res.status) {
        toast.success("Staked successfully");
        _getStakedTokenInfo();
        setAmount('');
      }
    })
  }

  const doUnStake = async () => {
    if (!amount) return toast.error("Please enter the amount first");

    if (parseFloat(amount) > parseFloat(amountToUnlock)) return toast.error("Please enter valid available amount");

    let data = {
      amount: await CommonService.convertWithDecimal(amount, xiv_decimals),
      walletAddress
    }
    dispatch(unStakeTokens(data)).then(async (res) => {
      if (res && res.status) {
        toast.success("Unstaked successfully");
        _getStakedTokenInfo();
        setAmount('');
      }
    })
  }

  const _claimRewards = async () => {
    dispatch(claimRewards({ walletAddress })).then(async (res) => {
      if (res && res.status) {
        toast.success("Claimed successfully");
        _getStakedTokenInfo();
      }
    })
  }
  return (
    <Wrapper>
      <MainHeading
        title="Liquidity"
      >
        <OverlayTrigger placement="right" overlay={popover}>
          <a className="detail_btnStyle">Detail</a>

        </OverlayTrigger>
      </MainHeading>

      <Container fluid>
        <LinkGroup
          leftbtn_title="Add Liquidity"
          leftLink
          rightbtn_title="Remove Liquidity"
          rightLink
          iconleft={addLiquidity}
          iconright={removeLiquidity}
          cstyles="liquidity-tab"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Row className="pool_info">
          <Col className="poolcard_style" lg={4}>
            <h2 className="poolcard_style__title">Your XIV in Liquidity Pool</h2>
            <p className="poolcard_style__subTitle">{xiv_decimals && stakeDetails.lastStakedAmount ? CommonService.fixedToDecimal(BigNumber(stakeDetails?.lastStakedAmount).div(xiv_decimals).toFixed()) : 0}</p>
            <ul className="poolcard_style__items">
              <li className="poolcard_style__avai">
                <p><img src={pool_available_icon} /> Available</p>
                <strong>{xiv_decimals && amountToUnlock ? amountToUnlock : 0}</strong>
              </li>
              {/* <li className="poolcard_style__Locked">
                <p><img src={pool_locked_icon} /> Locked</p>
                <strong>{stakeDetails.lastStakedAmount && xiv_decimals ? (parseInt(stakeDetails?.lastStakedAmount) - (parseInt(stakeDetails?.stakeResidual) + parseInt(amountToUnlock))) / xiv_decimals : 0}</strong>
              </li> */}
            </ul>
            <ul className="poolcard_style__items">
              <li className="poolcard_style__avai">
                <h2 className="poolcard_style__title">Liquidity Pool Gain/Loss</h2>
                <p className={`poolcard_style__subTitle bold ${stakeDetails && stakeDetails.pool_rewards != 0 ? stakeDetails.pool_rewards > 0 ? "positive" : "negative-down" : ""}`}><b>{xiv_decimals && stakeDetails.pool_rewards ? stakeDetails.pool_rewards : 0}</b></p>
              </li>
              {stakeDetails && stakeDetails.pool_rewards > 0 ? <li className="poolcard_style__Locked">
                <ButtonCustom title="Claim Rewards" onClick={() => _claimRewards()} className="mr-5 mb-3 claim-rewrd" />
              </li> : ''}
            </ul>

          </Col>
          <Col className="addInverse_liquidity">
            {activeTab === "stake" ? <Form>
              <Form.Group className="addInverse_liquidity_form" controlId="exampleForm.ControlInput1">
                <Form.Label>Add Inverse Liquidity Pool </Form.Label>
                <Col className="form-control-liquidity">
                  <Form.Control autoComplete="off" type="number" placeholder="0" value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
                  <span className="min_value_style">Min. {CommonService.fixedToDecimal(BigNumber(miniStakeAmount).div(xiv_decimals).toFixed())} XIV</span>
                </Col>
              </Form.Group>
              <Col className="allowExcess">
                <span className="allowExcess_label">Allow to access XIV</span>
                <Switch
                  onChange={handleChange}
                  checked={allowance}
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
                <ButtonCustom
                  onClick={() => doStake()}
                  title="Add Liquidity"
                  className="buttonAddLiquidity_style"
                  disabled={!allowance}
                />
              </Col>

            </Form> : <Form>
              <Form.Group className="addInverse_liquidity_form" controlId="exampleForm.ControlInput1">
                <Form.Label>Remove Inverse Liquidity Pool </Form.Label>
                <Col className="form-control-liquidity">
                  <Form.Control autoComplete="off" type="number" placeholder="0" value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
                  <ButtonCustom title="Max" onClick={() => setAmount(xiv_decimals && amountToUnlock && amountToUnlock > 0 ? amountToUnlock : 0)} className="mr-5 mb-3 claim-rewrd min_value_style max_button" />
                </Col>
              </Form.Group>
              <Col className="allowExcess">
                <ButtonCustom
                  onClick={() => doUnStake()}
                  title="Remove Liquidity"
                  className="buttonAddLiquidity_style"
                />
              </Col>

            </Form>}
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Liquidity;

const popover = (
  <Popover id="popover-basic">
    <Popover.Body className="popover-body">
      The Liquidity Vault (LV) ensures that there is available XIV to maintain the protocol’s staking and reward functions. Gains to users who stake XIV in the tracking vaults will come from the Liquidity Vault.  Conversely, losses and early unstake fees will be transferred to the Liquidity Vault.
    </Popover.Body>
  </Popover>
);