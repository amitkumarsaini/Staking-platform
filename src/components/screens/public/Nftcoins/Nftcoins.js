import React, { useEffect, useState } from "react";
import Wrapper from '../../../common/wrapper/Wrapper'
import { useParams } from "react-router-dom";
import MainHeading from '../../../common/mainHeading/MainHeading';
import { Container, Row, Col, Dropdown, Tab, Tabs, Form } from 'react-bootstrap';
import nftarrow from '../../../../theme/images/redactivearrow.svg'
import inlinestaking from '../../../../theme/images/right-arrow.svg'
import Coinlink from '../../../common/Coinlink/Coinlink';
import Platformheading from '../../../common/Platformheading/Platformheading';
import Table from 'react-bootstrap/Table'
import bnbicon from '../../../../theme/images/bnbicon.svg'
import graph from '../../../../theme/images/market-graph.svg'
import './Nftcoins.css'
import { getCoins } from "../../../../redux/actions/api.action"
import { callContractMethod } from "../../../../redux/actions/ethereum.action";
import { setUserPlatform } from "../../../../redux/actions/user.action";
import { useSelector, useDispatch } from "react-redux";
import Stakenowmodal from './Stakenowmodal';
import { CommonService } from "../../../../services/CommonService";
import { useHistory } from "react-router-dom";
import inactive from '../../../../theme/images/inactivearrow.svg'
import activearrow from '../../../../theme/images/activegreenarrow.svg';
import CanvasJSReact from '../../../lib/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
let options = {
    theme: "dark1", // "light1", "dark1", "dark2"
    height: 70,
    width: 180,
    backgroundColor: "#ccc0",
    animationEnabled: true,
    axisY: {
        lineThickness: 0,
        lineColor: "#0d0710",
        labelFontSize: 0,
        labelFontColor: "#0d0710",
        gridThickness: 0,
        tickLength: 0
    },
    axisX: {
        tickLength: 0,
        lineThickness: 0,
        lineColor: "#55c9a5",
        labelFontSize: 0,
        labelFontColor: "#55c9a5",
        labelBackgroundColor: "#0d0710",
        gridThickness: 0,
    },
    data: [{
        type: "spline",
        lineColor: "#2fca74",
        markerType: "none",
        lineThickness: 1,
        dataPoints: [

        ]
    }]
}


function Nftcoins() {
    const platform = useSelector((state) => state.user.platform);
    const [state, setState] = useState({});
    const params = useParams();
    let [coinType, setCoinType] = useState(CommonService.getCoinType(params.coinType));
    const flexible_Plans = useSelector((state) => state.ethereum.flexible_Plans);
    const fixed_plan = useSelector((state) => state.ethereum.fixed_plan);
    const bet_days_flexible = useSelector((state) => state.ethereum.bet_days_flexible);
    const bet_days_fixed = useSelector((state) => state.ethereum.bet_days_fixed);
    let [coinsList, setCoinsList] = useState([]);
    let [activeTab, setActiveTab] = useState('FixedVaults');
    let planType = activeTab === "FixedVaults" ? 1 : 2;
    let [miniBetAmount, setMiniBetAmount] = useState(0);
    let [maxBetAmount, setMaxBetAmount] = useState(0);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(async () => {
        coinType = CommonService.getCoinType(params.coinType);
        setCoinType(coinType)
    }, [params])

    useEffect(async () => {
        getPlansDetails()
    }, [])

    useEffect(async () => {
        getCoinsList()
    }, [coinType, activeTab])

    const getCoinsList = async () => {
        let data = {
            coinType: coinType,
            planType: planType
        }
        let coinsList = await dispatch(getCoins(data));
        if (coinsList && coinsList.data) {
            setCoinsList(coinsList.data)
            {
                coinsList.data.map((data, i) => {
                    if (data.previousPrices.length) {
                        let customOption = options;
                        let chartData = [];
                        let previousPrices = data.previousPrices;
                        for (var i = 0; i < previousPrices.length; i++) {
                            let temp = {};
                            temp.x = new Date(previousPrices[i].createdAt);
                            temp.y = parseFloat(previousPrices[i].price / 10 ** 8);
                            chartData.push(temp);
                        }
                        customOption.data[0].dataPoints = chartData;
                        setState(prevState => ({ ...prevState, [data.symbol]: customOption }));
                    }
                }
                )
            }
        }

    }

    const getPlansDetails = async () => {
        dispatch(callContractMethod('miniBetAmount')).then(async (miniBetAmount) => {
            setMiniBetAmount(miniBetAmount)
        })

        dispatch(callContractMethod('maxBetAmount')).then(async (maxBetAmount) => {
            setMaxBetAmount(maxBetAmount)
        })

    }

    const changePlatForm = () => {
        dispatch(setUserPlatform(platform === 1 ? 2 : 1))
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <>

            <Wrapper>
                <MainHeading title="Tracking Vaults
" />
                <Container fluid>
                    {platform === 1 ? <Coinlink
                        leftbtn_title="NFT Coins"
                        leftLink="NFTCoins"
                        rightbtn_title=""
                        rightLink="Inlinecoin"
                        iconleft={nftarrow}
                        iconright={inlinestaking}
                        coinType={coinType}
                        history={history}
                        changePlatForm={changePlatForm}
                        cstyle="platform-tab nft-tab"
                    /> :
                        <Coinlink
                            leftbtn_title="coins"
                            leftLink="NFTCoins"
                            rightbtn_title=""
                            rightLink="Inlinecoin"
                            iconleft={activearrow}
                            iconright={inactive}
                            coinType={coinType}
                            history={history}
                            changePlatForm={changePlatForm}
                            cstyle="coin-tab"
                        />}
                    <Row className="title-line ">
                        <Col className="text-center" lg={12}>
                            <p>{planType === 1 ? "Stake XIV in tracking vaults for 6hrs at a fixed risk & reward." : "Stake XIV in tracking vaults for 24hrs, 3-days, and 7-days at a flexible risk & reward."}</p>

                        </Col>
                        <Col className="" lg={12} className="fixed-tabs green-tab">
                            <Tabs defaultActiveKey={activeTab} id="uncontrolled-tab-example" className="mb-3" onSelect={(tab) => setActiveTab(tab)}>
                                <Tab eventKey="FixedVaults" title="Fixed Vaults" className="">
                                </Tab>
                                <Tab eventKey="FlexibleVault" title="Flexible Vaults">
                                </Tab>
                            </Tabs>
                            <div className="inverse-table table-responsive">
                                <Table striped className="table_center">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th className="bold">Last price</th>
                                            <th>24h change</th>
                                            <th width="15%">Market</th>
                                            {planType === 2 ? <th>{platform === 1 ? "Drop Value" : "Rise Value"}</th> : ""}
                                            <th>
                                                <Dropdown className="sort-btn table-sort">
                                                    {/* <Dropdown.Toggle variant="outline" id="dropdown-basic">
                                                    Sort by
                                                </Dropdown.Toggle> */}

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {coinsList && coinsList.length ? coinsList.map((item, index) => (
                                            <tr>
                                                <td className="bold"> <img src={item.logo} />{item.symbol}</td>
                                                <td className="bold">{item.freshPrice ? '$' + (item.freshPrice / 10 ** 8).toFixed(4) : '-'}</td>
                                                <td className={`bold ${item.change24 ? item.change24 > 0 ? "positive" : "negative" : ""}`}>{item.change24 ? item.change24.toFixed(2) + '%' : '-'}</td>

                                                <td className="chartTableData">
                                                    {state[item.symbol] ? <CanvasJSChart options={state[item.symbol]} /> : ""}
                                                </td>
                                                {planType === 2 ? <td>
                                                    <Form.Control as="select" className="drop-value" onChange={(e) => setState(prevState => ({ ...prevState, [index]: e.target.value }))}>
                                                        <option className="optiontext">{platform === 1 ? "Drop Value" : "Rise Value"}</option>
                                                        {flexible_Plans.map((item, index) => (
                                                            <option className="optiontext" value={item.drop}>{platform === 1 ? '-' : ''}{item.drop}%</option>
                                                        ))}
                                                    </Form.Control>

                                                </td> : ''}
                                                <td>
                                                    <Stakenowmodal
                                                        selectedDropValue={state[index]}
                                                        miniBetAmount={miniBetAmount}
                                                        maxBetAmount={maxBetAmount}
                                                        betDays={item.planType === 1 ? bet_days_fixed : bet_days_flexible}
                                                        coin={item}
                                                        planType={planType}
                                                        fixedPlans={fixed_plan}
                                                        flexiblePlans={flexible_Plans}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <Col className="text-center" lg={12}>
                                            <p className="noData">No {capitalizeFirstLetter(params.coinType)} Coins Found!</p>

                                        </Col>}

                                    </tbody>
                                </Table>

                            </div>
                            {/* <Platformheading cstyle="platform-heading" tableheading="Fixed Vaults" /> */}

                        </Col>


                    </Row>
                </Container>
                <p className="subline-text">** Only the prices on the Inverse / In-Line Platform are valid & will be used to calculate gains and losses. Prices of assets listed on other platforms will not apply.
                    </p>
            </Wrapper >

        </>
    )
}

export default Nftcoins
