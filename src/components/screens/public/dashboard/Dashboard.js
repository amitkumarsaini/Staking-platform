import React, { useEffect, useState } from "react";
import { Form, Container, CardGroup, Dropdown, Table } from 'react-bootstrap'
import Wrapper from '../../../common/wrapper/Wrapper'
import MainHeading from '../../../common/mainHeading/MainHeading';
import Dashboardcard from '../../../common/Dashboardcard/Dashboardcard';
import stakeicon from '../../../../theme/images/inverse-icon.svg'
import inlineicon from '../../../../theme/images/inline-icon.svg'
import rewardicon from '../../../../theme/images/reward-icon.svg'
import './Dashboard.css';
import Switch from "react-switch";
import Tableheading from '../../../common/Tableheading/Tableheading';
import tableicon from '../../../../theme/images/red-arrow.svg'
import Inversetable from '../../../common/Inversetable/Inversetable';
import inlinetableicon from '../../../../theme/images/green-arrow.svg'
import { claimBets, getTokenDecimals, callContractMethod, betPenalty } from "../../../../redux/actions/ethereum.action";
import { useSelector, useDispatch } from "react-redux";
import { getBets } from "../../../../redux/actions/api.action";
import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import { toast } from "../../../Toast/Toast";
import { XIV, COIN_LIST, COIN_LIST_BNB } from "../../../../constant";
import Icon from "@material-ui/core/Icon";
import _ from "lodash";
import moment from "moment";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import close from '../../../../theme/images/sidebar_close.svg'
import { CommonService } from "../../../../services/CommonService";
let MAIN_COIN_LIST = COIN_LIST;
let network = localStorage.getItem("network");

if (network === "bnb") {
    MAIN_COIN_LIST = COIN_LIST_BNB
}
let bet_checker;
let bet_checker_endTime;
const Dashboard = () => {
    const [selectedDate, handleDateChange] = useState(null);
    const [timerHnadler, handleTimer] = useState(new Date());
    const dispatch = useDispatch();
    const [inverseBetList, setInverseBetList] = useState([]);
    const [inlineBetList, setInlineBetList] = useState([]);
    const [betRewards, setBetRewards] = useState(0);
    const [hideEnded, setHideEnded] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const xiv_decimals = useSelector((state) => state.ethereum.xiv_decimals);
    const walletAddress = useSelector((state) => state.user.walletAddress);
    const flexible_Plans = useSelector((state) => state.ethereum.flexible_Plans);
    const fixed_plan = useSelector((state) => state.ethereum.fixed_plan);
    useEffect(async () => {
        if (walletAddress) {
            setInlineBetList([])
            setInverseBetList([])
            getBetRewards();
            _getBets();
            bet_checker_interval();
        }
    }, [walletAddress, selectedDate, hideEnded])


    useEffect(() => {
        document.body.className += " redactive";
        return () => {
            clearInterval(bet_checker);
            clearInterval(bet_checker_endTime);
        }
    }, []);

    useEffect(() => {
        clearInterval(bet_checker_endTime);
        bet_checker_interval_endTime();
    }, [inlineBetList, inverseBetList]);


    const getBetRewards = async (loader = true) => {
        dispatch(callContractMethod('getBetRewards', [walletAddress], loader)).then((betRewards) => {
            setBetRewards(betRewards)
        })
        dispatch(callContractMethod('users', [walletAddress], loader)).then((userInfo) => {
            setUserInfo(userInfo)
        })
    }

    const bet_checker_interval = async () => {
        await clearInterval(bet_checker);
        bet_checker = setInterval(async function myTimer() {
            if (walletAddress) {
                _getBets(false);
                getBetRewards(false);
            }
        }, 5000);
        bet_checker_endTime = setInterval(async function myTimer() {
            if (walletAddress) {
                await handleTimer(new Date());
            }
        }, 1000);

    }

    const bet_checker_interval_endTime = async () => {
        await clearInterval(bet_checker_endTime);
        bet_checker_endTime = setInterval(async function myTimer() {
            if (walletAddress) {
                await handleTimer(new Date());
            }
        }, 1000);

    }
    const _getBets = async (loader = true) => {
        let inlineBetList = await dispatch(getBets({ address: walletAddress, isInverse: false, startTime: moment(selectedDate).unix(), hide: hideEnded }, loader));
        if (inlineBetList && inlineBetList.data && inlineBetList.data.betData) {
            for (var j = 0; j < inlineBetList.data.betData.length; j++) {
                let inline_bet = inlineBetList.data.betData[j];
                let tokenInfo = _.find(MAIN_COIN_LIST, function (o) { return o.address.toLocaleLowerCase() === inline_bet.paymentTokenAddress.toLocaleLowerCase(); })
                inlineBetList.data.betData[j].tokenInfo = tokenInfo;
                let data = {
                    tokenAddress: inline_bet.paymentTokenAddress
                }
                let tokenDecimals = await dispatch(getTokenDecimals(data));
                inlineBetList.data.betData[j].tokenDecimals = tokenDecimals;
                if (j === inlineBetList.data.betData.length - 1) {
                    setInlineBetList(inlineBetList.data);
                }
            };

        }

        let inverseBetList = await dispatch(getBets({ address: walletAddress, isInverse: true, startTime: moment(selectedDate).unix(), hide: hideEnded }, loader));
        if (inverseBetList && inverseBetList.data && inverseBetList.data.betData) {
            for (var i = 0; i < inverseBetList.data.betData.length; i++) {
                let bet = inverseBetList.data.betData[i];
                let tokenInfo = _.find(MAIN_COIN_LIST, function (o) { return o.address.toLocaleLowerCase() === bet.paymentTokenAddress.toLocaleLowerCase(); })
                inverseBetList.data.betData[i].tokenInfo = tokenInfo;
                let data = {
                    tokenAddress: bet.paymentTokenAddress
                }
                let tokenDecimals = await dispatch(getTokenDecimals(data));
                inverseBetList.data.betData[i].tokenDecimals = tokenDecimals;
                if (i === inverseBetList.data.betData.length - 1) {
                    setInverseBetList(inverseBetList.data);
                }
            };

        }
    }

    const _claimRewards = async () => {
        dispatch(claimBets({ walletAddress })).then(async (res) => {
            if (res && res.status) {
                toast.success("Claimed successfully");
                getBetRewards();
            }
        })
    }

    const _betPenalty = async (betIndex) => {
        dispatch(betPenalty({ walletAddress, betIndex })).then(async (res) => {
            if (res && res.status) {
                toast.success("Claimed successfully");
                setTimeout(function () { window.location.reload(); }, 2000);
            }
        })
    }

    const clear_all = async () => {
        handleDateChange(null);
        setHideEnded(false)
    }
    return (
        <Wrapper>
            <Container className="faq" fluid>
                <MainHeading title="My Dashboard" subtitle="Review all your staked positions here. See your gains and manage your losses." />
                <CardGroup>
                    <Dashboardcard cstyle="red-card" heading="INVERSE" subheading="My XIV Staked" stake={inverseBetList.result && inverseBetList.result.length && xiv_decimals ? CommonService.fixedToDecimal(inverseBetList.result[0]?.totalSaleAmount / xiv_decimals) : 0} stake_icon={stakeicon}></Dashboardcard>
                    <Dashboardcard cstyle="green-card" heading="IN-LINE" subheading="My XIV Staked" stake={inlineBetList.result && inlineBetList.result.length && xiv_decimals ? CommonService.fixedToDecimal(inlineBetList.result[0]?.totalSaleAmount / xiv_decimals) : 0} stake_icon={inlineicon}></Dashboardcard>
                    <Dashboardcard cstyle="purple-card" heading="My rewards" subheading="&nbsp;" stake={inverseBetList.result && inverseBetList.claimedAmount.length && xiv_decimals ? CommonService.fixedToDecimal(inverseBetList.claimedAmount[0]?.totalSaleAmount / xiv_decimals) : inlineBetList.result && inlineBetList.claimedAmount.length && xiv_decimals ? CommonService.fixedToDecimal(inlineBetList.claimedAmount[0]?.totalSaleAmount / xiv_decimals) : 0} stake_icon={rewardicon}></Dashboardcard>

                </CardGroup>
                <div className="sort-col">
                    <Form className="toggle-switch">
                        {/* <label>Hide ended</label>
                        <Switch
                            onChange={(e) => setHideEnded(!hideEnded)}
                            checked={hideEnded}
                            uncheckedIcon={false}
                            checkedIcon={false}
                        /> */}


                    </Form>

                    <div className="d-flex">
                        {xiv_decimals ? <span className="color-info bold"> {betRewards > 0 ? (parseInt(betRewards) / xiv_decimals).toFixed(2) : 0} XIV Rewards Available</span> : ''}
                        <div>   <ButtonCustom title="Claim XIV" onClick={() => _claimRewards()} className="mr-5 mb-3 claim-rewrd" />
                            <Form className="toggle-switch">
                                <KeyboardDatePicker
                                    className="slct-dte"
                                    variant="inline"
                                    label="Transaction Hx"
                                    value={selectedDate}
                                    autoOk
                                    clearable
                                    disableFuture
                                    format="DD/MM/YYYY"
                                    onChange={handleDateChange}
                                    emptyLabel="--/--/----" //<--- custom placeholder when date is null
                                    InputProps={{ className: !selectedDate ? 'datepicker' : null }} //<----apply style when no date selected
                                    keyboardIcon={<img src={'https://www.pinclipart.com/picdir/middle/57-579702_ic-event-48px-calendar-icon-material-design-clipart.png'} alt="calendar" width={20} />}
                                />
                                {selectedDate ? <span className="clear_all" onClick={clear_all}><img src={close} /></span> : ''}
                            </Form>
                        </div>
                        <Dropdown className="sort-btn">


                            {/* <Dropdown.Toggle variant="outline" id="dropdown-basic">
                                Sort by
                        </Dropdown.Toggle> */}

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <Tableheading cstyle="table-heading" tableicon={tableicon} tableheading="Inverse Staking"></Tableheading>
                <Inversetable timerHnadler={timerHnadler} list={inverseBetList.betData} _betPenalty={_betPenalty} flexible_Plans={flexible_Plans} fixed_plan={fixed_plan} />
                <Tableheading cstyle="green-table-heading table-heading" tableicon={inlinetableicon} tableheading="In-line Staking"></Tableheading>
                <Inversetable timerHnadler={timerHnadler} list={inlineBetList.betData} _betPenalty={_betPenalty} flexible_Plans={flexible_Plans} fixed_plan={fixed_plan} />
            </Container>
        </Wrapper>
    )
}

export default Dashboard
