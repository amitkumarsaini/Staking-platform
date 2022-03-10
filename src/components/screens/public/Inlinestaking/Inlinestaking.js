import React, { useEffect, useState } from "react";
import Wrapper from '../../../common/wrapper/Wrapper'
import MainHeading from '../../../common/mainHeading/MainHeading';
import LinkGroup from '../../../common/linkGroup/LinkGroup';
import inactive from '../../../../theme/images/inactivearrow.svg'
import activearrow from '../../../../theme/images/activegreenarrow.svg'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Platformheading from '../../../common/Platformheading/Platformheading';
import Inversestakingcard from '../../../common/Inversestakingcard/Inversestakingcard';
import { setUserPlatform } from "../../../../redux/actions/user.action";
import { useDispatch } from "react-redux";
import './inlinestaking.css'
const Inlinestaking = () => {
    const dispatch = useDispatch();
    document.body.classList.remove("redactive");
    document.body.className += " greenactive";
    useEffect(async () => {
        dispatch(setUserPlatform(2))
    }, [])
    return (
        <Wrapper>
            <MainHeading title="Tracking Vaults" />
            <Container fluid>
                <LinkGroup
                    leftbtn_title="Inverse Staking"
                    leftLink="Inversestaking"
                    rightbtn_title="In-line Staking"
                    rightLink="Inlinestaking"
                    iconleft={inactive}
                    iconright={activearrow}
                    cstyles="inline-tab"
                />
                <Row className="title-line ">
                    <Col className="text-center" lg={12}>
                        <p>Stake XIV and earn rewards to the Upward movement of select coins.</p>
                    </Col>
                    <Col className="" lg={12}>
                        <Row>
                            <Col className="deficol" lg={8} >
                                <Link to="coins/defi">  <Inversestakingcard cstyle="green-border" defilinks="DeFi Coins" /></Link>
                                <Link to="coins/chain">    <Inversestakingcard cstyle="green-border" defilinks="Chain Coins" /></Link>
                                <Link to="coins/nft"> <Inversestakingcard cstyle="green-border" defilinks="NFT Coins" /></Link>
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

export default Inlinestaking
