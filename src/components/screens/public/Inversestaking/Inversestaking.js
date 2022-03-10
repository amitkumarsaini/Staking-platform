import React, { useEffect, useState } from "react";
import Wrapper from '../../../common/wrapper/Wrapper'
import MainHeading from '../../../common/mainHeading/MainHeading';
import LinkGroup from '../../../common/linkGroup/LinkGroup';
import inversestaking from '../../../../theme/images/redactivearrow.svg'
import inlinestaking from '../../../../theme/images/right-arrow.svg'
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Inversestaking.css'
import Platformheading from '../../../common/Platformheading/Platformheading';
import Inversestakingcard from '../../../common/Inversestakingcard/Inversestakingcard';
import { callContractMethod } from "../../../../redux/actions/ethereum.action";
import { useSelector, useDispatch } from "react-redux";
import { setUserPlatform } from "../../../../redux/actions/user.action";

const Inversestaking = () => {
    document.body.className += " redactive";
    const dispatch = useDispatch();

    useEffect(async () => {
        dispatch(setUserPlatform(1))
    }, [])
    return (
        <Wrapper>
            <MainHeading title="Tracking Vaults" />

            <Container fluid>
                <LinkGroup
                    leftbtn_title="Inverse Staking"
                    leftLink="Inversestaking"
                    rightbtn_title="In-line Staking"
                    rightLink="inlinestaking"
                    iconleft={inversestaking}
                    iconright={inlinestaking}

                    cstyle="platform-tab"
                />
                <Row className="title-line ">
                    <Col className="text-center" lg={12}>
                        <p>Stake XIV and earn rewards to the downward movement of select coins.</p>
                    </Col>
                    <Col className="" lg={12}>
                        <Row>
                            <Col className="deficol" lg={8} >
                                <Link to="coins/defi">  <Inversestakingcard cstyle="red-border" defilinks="DeFi Coins" /></Link>
                                <Link to="coins/chain">    <Inversestakingcard cstyle="red-border" defilinks="Chain Coins" /></Link>
                                <Link to="coins/nft"> <Inversestakingcard cstyle="red-border" defilinks="NFT Coins" /></Link>
                            </Col>
                            {/* <Col className="deficol" lg={4}>
                                <Inversestakingcard cstyle="grad-border" defilinks="Indexes" />
                            </Col> */}
                        </Row>
                    </Col>


                </Row>
            </Container>
        </Wrapper>

    )
}

export default Inversestaking
