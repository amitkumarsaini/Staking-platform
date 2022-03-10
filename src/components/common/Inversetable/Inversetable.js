import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table'
import './Inversetable.css'
import moment from "moment";
import ConfirmModal from './confirmModal';
import ConfirmModal2 from './confirmModal2';
import _ from "lodash";
import { CommonService } from "../../../services/CommonService";


const Inversetable = (props) => {

    const calculateTimeLeft = (timestamp, status) => {
        let timeleft;
        if (status === 0) {
            let data = new Date((timestamp + 60) * 1000);
            let betTime = moment.utc(data);
            let leftDays = moment.duration(moment(betTime).diff(moment()));
            let days = parseInt(leftDays.asDays())
            let hrs = parseInt(leftDays.asHours() % 24)
            let min = parseInt(leftDays.asMinutes()) % 60;
            let sec = parseInt(leftDays.asSeconds()) % 60;
            if (days >= 0 &&
                hrs >= 0 &&
                min >= 0 &&
                sec >= 0 && status === 0) {
                if (days > 0) {
                    timeleft = days + " d " + hrs + "h : " + min + "m : " + sec + "s";
                } else if (hrs > 0) {
                    timeleft = hrs + "h : " + min + "m : " + sec + "s";
                } else if (min > 0) {
                    timeleft = min + "m : " + sec + "s";
                } else if (sec > 0) {
                    timeleft = sec + "s";
                }
            } else {
                if (status === 0) {
                    timeleft = "Processing"
                } else {
                    timeleft = "Ended"
                }
            }
        } else {
            timeleft = "Ended"
        }
        return timeleft
    }

    return (
        <div className="inverse-table table-responsive">
            <Table striped className="table_center">
                <thead>
                    <tr>
                        <th>Start date</th>
                        <th className="bold">Staked</th>
                        <th>Asset</th>
                        <th>Initial Price</th>
                        <th>Final Price</th>
                        <th>% change</th>
                        <th>End Time</th>
                        <th>Rewards</th>
                        <th>Risk</th>
                        <th >Status</th>
                        <th ></th>
                        {/* <th ></th> */}
                    </tr>
                </thead>
                <tbody>
                    {props.list && props.list.length ? props.list.map((bet, index) => (
                        <tr>
                            <td className="bold">{moment.unix(bet.startTime).format("MM/DD/YYYY hh:mm A")}</td>
                            <td className="bold">
                                <img width={20} src={bet.tokenInfo?.logo} />
                                {bet.plandata.length ? CommonService.fixedToDecimal(parseFloat(bet.plandata[0].amount) / bet.tokenDecimals) : ''} {bet.tokenInfo?.name}</td>
                            <td className="bold"> <img className="bnb-icon" src={bet.coinLogo.logo} />{bet.coinLogo.symbol}{bet.plandata[0].planType === 1 ? ' (Fixed)' : ' (Flexible)'}</td>
                            <td className="bold">{bet.plandata[0].initialPrice ? '$' + parseFloat(bet.plandata[0].initialPrice / 10 ** 8) : "-"}</td>
                            <td className="bold">{bet.plandata[0].status !== 0 && bet.plandata[0].finalPrice ? '$' + parseFloat(bet.plandata[0].finalPrice / 10 ** 8) : bet.plandata[0].status === 0 && bet.currentPrice ? '$' + parseFloat(bet.currentPrice / 10 ** 8) : "-"}</td>
                            <td className={`bold ${bet.plandata[0].status !== 0 ? bet.plandata[0].finalPrice && bet.plandata[0].finalPrice != bet.plandata[0].initialPrice ? bet.plandata[0].finalPrice > bet.plandata[0].initialPrice ? "positive" : "negative" : "" : bet.changeFromStake ? parseFloat(bet.changeFromStake) > 0 ? 'positive' : 'negative' : ''}`}>{bet.plandata[0].status !== 0 ? bet.plandata[0].finalPrice ? (((parseFloat(bet.plandata[0].finalPrice) - parseFloat(bet.plandata[0].initialPrice)) / parseFloat(bet.plandata[0].initialPrice)) * 100).toFixed(2) + '%' : '-' : bet.changeFromStake ? parseFloat(bet.changeFromStake).toFixed(2) + '%' : '0.00%'}</td>
                            <td className="bold">{calculateTimeLeft(bet.endTime, bet.plandata[0].status)}</td>
                            <td className="bold yellow-text">{bet.plandata.length ? bet.plandata[0].reward : ''}%</td>
                            <td className="bold text-red">{bet.plandata[0].risk ? bet.plandata[0].risk : 0}%</td>
                            <td className="bold">{bet.plandata.length ? bet.plandata[0].status === 0 ? 'Pending' : bet.plandata[0].status === 1 ? 'Won' : bet.plandata[0].status === 2 ? 'Lost' : bet.plandata[0].status === 3 ? 'Unstaked' : "" : ''}</td>
                            <td className="bold text-center">{bet.plandata.length ? bet.plandata[0].status === 0 && bet.plandata[0].isClaimed === false ? <ConfirmModal _betPenalty={props._betPenalty} bet={bet} /> : bet.plandata[0].isClaimed || bet.plandata[0].status === 3 ? "Claimed" : "Not Claimed" : ''}</td>
                            {/* <td>
                                {bet.plandata.length && bet.plandata[0].status !== 0 ? <ConfirmModal2 _betPenalty={props._betPenalty} bet={bet} /> : ""}
                            </td> */}
                        </tr>
                    )) : ''}

                </tbody>
            </Table>
            {!props.list || props.list && !props.list.length ? <div class="text-center col-lg-12"><p>No Data Found</p></div> : ''}
        </div>
    )
}

export default Inversetable