import React, { useEffect, useState } from "react";
import { Col, Form, Row, Dropdown, Container, Table } from 'react-bootstrap'

import Wrapper from '../../../common/wrapper/Wrapper';
import MainHeading from '../../../common/mainHeading/MainHeading';
import './Userrank.css'
import { getRewardsRanks, getRewardsRanksMonthly } from "../../../../redux/actions/api.action";
import { useSelector, useDispatch } from "react-redux";

function Userrank() {
    const dispatch = useDispatch();
    document.body.classList.remove("greenactive");
    document.body.className += ' yellowactive redactive';
    const [rewardRanks, setRewardRanks] = useState([]);
    const [rewardRanksMonthly, setRewardRanksMonthly] = useState([]);
    const xiv_decimals = useSelector((state) => state.ethereum.xiv_decimals);

    useEffect(() => {

        _getRewardsRanks();
    }, []);

    const _getRewardsRanks = async () => {
        let ranks = await dispatch(getRewardsRanks());
        if (ranks && ranks.data) {
            setRewardRanks(ranks.data)
        }

        let ranksMonthly = await dispatch(getRewardsRanksMonthly());
        if (ranksMonthly && ranksMonthly.data) {
            setRewardRanksMonthly(ranksMonthly.data)
        }
    }
    const custmizeAddress = (address) => {
        let firstFive = address.substring(0, 5);
        let lastFour = address.substr(address.length - 4);
        return firstFive + "..." + lastFour;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date();
    return (
        <Wrapper>
            <Container fluid className="faq " >

                <Row>
                    <Col lg={6} className="table-padding">
                        <div className="user-rank">
                            <div className="rank-top">
                                <Col className="common-heading">
                                    <Row>
                                        <Col md={8}> <h4 className="title_style"><span>LEGACY  BOARD</span></h4>
                                        </Col>
                                    </Row>
                                </Col >
                            </div>
                            <div className="inverse-table table-responsive">
                                <Table striped >
                                    <thead>
                                        <tr>
                                            <th>Rank: </th>
                                            <th>User:</th>
                                            <th className="text-right">Total Gains:</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {xiv_decimals && rewardRanks.length ? rewardRanks.map((item, index) => (<tr>
                                            <td>{index + 1}</td>
                                            <td>{custmizeAddress(item._id.user)}</td>
                                            <td className="yellow-text bold text-right">{(item.totalSaleAmount / xiv_decimals).toFixed(2)} XIV</td>
                                        </tr>)) : ''}
                                        {rewardRanks && !rewardRanks.length ? <tr class="text-center text-white col-lg-12"><td colSpan="3"> No Rank Found</td></tr> : ''}


                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="table-padding">
                        <div className="user-rank">
                            <div className="rank-top">
                                <Col className="common-heading">
                                    <Row>
                                        <Col md={8}> <h4 className="title_style"><span>MONTHLY LEADERBOARD ({monthNames[d.getMonth()].toUpperCase()})</span></h4>
                                        </Col>
                                    </Row>
                                </Col >
                            </div>
                            <div className="inverse-table table-responsive">
                                <Table striped >
                                    <thead>
                                        <tr>
                                            <th>Rank: </th>
                                            <th>User:</th>
                                            <th className="text-right">Total Gains:</th>


                                        </tr>
                                    </thead>
                                    <tbody>

                                        {xiv_decimals && rewardRanksMonthly.length ? rewardRanksMonthly.map((item, index) => (<tr>
                                            <td>{index + 1}</td>
                                            <td>{custmizeAddress(item._id.user)}</td>
                                            <td className="yellow-text bold text-right">{(item.totalSaleAmount / xiv_decimals).toFixed(2)} XIV</td>
                                        </tr>)) : ''}
                                        {rewardRanksMonthly && !rewardRanksMonthly.length ? <tr class="text-center text-white col-lg-12"><td colSpan="3"> No Rank Found</td></tr> : ''}


                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>

            </Container>
        </Wrapper>
    )
}

export default Userrank
