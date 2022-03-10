import React from 'react'
import { Container, Accordion } from 'react-bootstrap';
import Wrapper from '../../../common/wrapper/Wrapper';
import MainHeading from '../../../common/mainHeading/MainHeading';
import './FaqStyle.css'

const Faq = () => {


    return (
        <Wrapper>
            <Container className="faq" fluid>
                <MainHeading title="FAQ" />
                <Accordion defaultActiveKey="0">
                    <Accordion.Item as="li" eventKey="0">
                        <Accordion.Header>XIV TOKEN</Accordion.Header>
                        <Accordion.Body>
                            XIV is the sole token used for staking in the designated tracking vaults. Once the user connects their web3 wallet (i.e. MetaMask) to the platform, the user must allow the protocol to access the XIV in their wallet in order to stake.
                        </Accordion.Body>
                    </Accordion.Item>
                    {/* <Accordion.Item as="li" eventKey="1">
                        <Accordion.Header>VAULT FEE</Accordion.Header>
                        <Accordion.Body>
                            A Vault Fee of 7% of the staked amount is withdrawn by the protocol prior to staking. This fee goes to the Liquidity Vault and is proportionally divided between all the contributors to the LV.

                        </Accordion.Body>
                    </Accordion.Item> */}
                    <Accordion.Item as="li" eventKey="2">
                        <Accordion.Header>OTHER COIN OPTIONS</Accordion.Header>
                        <Accordion.Body>
                            Users who do not have XIV but still wish to stake may select among the list of alternative coins listed in the Tracking Vault. Once the user has granted the protocol access to this coin and has selected the amount that they wish to stake, this value will be converted to the appropriate amount of XIV in real-time. The user will pay the Vault Fee in the alternative coin and the rest of the staked amount will be held by the protocol until the end of the staking period. Fees paid in alternative coins will be held by the INVERSE Treasury.

                        </Accordion.Body>
                    </Accordion.Item>

                    {/* <Accordion.Item as="li" eventKey="3">
                        <Accordion.Header>FORFEITURES & LOSSES</Accordion.Header>
                        <Accordion.Body>
                            There are NO FORFEITURES or LOSSES on the platform. Users who do not win their bet at the end of the staking period will be refunded their full staked amount minus the Vault Fee.

                        </Accordion.Body>
                    </Accordion.Item> */}

                    <Accordion.Item as="li" eventKey="4">
                        <Accordion.Header>EARLY UNSTAKE FEE</Accordion.Header>
                        <Accordion.Body>
                            Users who wish to withdraw or “Unstake” their staked funds prior to the end of the staking period will be subject to a 50% Early Unstake Fee.

                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="5">
                        <Accordion.Header>TRACKING VAULTS</Accordion.Header>
                        <Accordion.Body>
                            Tracking vaults follow the price movements of popular crypto assets. Users hold XIV in the tracking vault of their choice for a staking period of either 12hrs, 24hrs, 72hrs (3 days), or 168hrs (7 days), and may earn gains inverse to or in-line with the price movements of the asset they are tracking.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="6">
                        <Accordion.Header>INVERSE STAKING</Accordion.Header>
                        <Accordion.Body>
                            Users may stake XIV and earn gains from downward movement of select assets.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="7">
                        <Accordion.Header>IN-LINE STAKING</Accordion.Header>
                        <Accordion.Body>
                            Users may stake XIV and earn gains from downward movement of select assets.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="8">
                        <Accordion.Header>FIXED TRACKING VAULTS</Accordion.Header>
                        <Accordion.Body>
                            <ul className="paq_li">
                                <li>
                                    <p>Drop / Rise Value: 4%</p>
                                </li>
                                <li>
                                    <p>Risk: 50%</p>
                                </li>
                                <li>
                                    <p>Reward: XIV Staked + 3x XIV Staked </p>
                                </li>
                                <li>
                                    <p>Staking Period: 6hrs</p>
                                </li>
                            </ul>
                            Each Fixed vault tracks a single coin or asset. Users who stake XIV in the Fixed tracking vaults expect the price of the tracked asset to fall or rise by = or > 4% in 6hrs or less. If this occurs, the user will receive a return of the principal amount staked + 300%  the principal amount. If this fails to occur, the user will forfeit 50% of their staked asset.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="9">
                        <Accordion.Header>FLEXIBLE TRACKING VAULTS</Accordion.Header>
                        <Accordion.Body>
                            <ul className="paq_li list-unstyled">
                                <li>
                                    <p>Drop / Rise Value: 3%, 5%, 7%</p>
                                </li>
                                <li>
                                    <p>Risk: 25%</p>
                                </li>
                                <li>
                                    <p>Reward: XIV Staked + 1x, 2x, 3x XIV Staked  </p>
                                </li>
                                <li>
                                    <p>Staking Period: 24hrs, 3-days (72hrs), 7-days (168hrs)</p>
                                </li>
                            </ul>
                            Each Flexible vault tracks a single coin or asset. Users who stake XIV in the Flexible tracking vaults seek a variable-community determined drop or rise in the price of the asset being tracked within a select timeframe or staking-period. Prior to staking, the user sets a drop-value or rise-value among the three choices. If the value of the asset drops or rises by = or > the set percentage, the user will receive a return of the principal amount staked + 100%, 200%, or 300%  the principal amount respectively. If this fails to occur, the user will forfeit 25% of their staked asset.
                                                </Accordion.Body>
                    </Accordion.Item>
                    {/* <Accordion.Item as="li" eventKey="10">
                        <Accordion.Header>FEES</Accordion.Header>
                        <Accordion.Body>
                            Vault Fee: 7% of Staked Amount
                            Early Withdrawal / Unstake Fee: 7% of Staked Amount
                        </Accordion.Body>
                    </Accordion.Item> */}
                    <Accordion.Item as="li" eventKey="11">
                        <Accordion.Header>INVERSE TREASURY</Accordion.Header>
                        <Accordion.Body>
                            The INVERSE Treasury will hold fees paid in alternative coins and will use these funds to grow and sustain PROJECT INVERSE.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="12">
                        <Accordion.Header>LIQUIDITY VAULT</Accordion.Header>
                        <Accordion.Body>
                            The Liquidity Vault (LV) ensures that there is available XIV to maintain the protocol’s staking and reward functions. Gains to users who stake XIV in the tracking vaults will come from the Liquidity Vault.  Conversely, losses and early unstake fees will be transferred to the Liquidity Vault. Users who help maintain the LV will receive on-going XIV rewards from a portion of the fees. LV rewards will be in proportion to the percentage of XIV that each user maintains as a portion of the entire Liquidity Vault.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item as="li" eventKey="13">
                        <Accordion.Header>ASSET PRICES </Accordion.Header>
                        <Accordion.Body>
                            Asset prices are sourced using APIs from CryptoCompare, a global cryptocurrency market data provider. CryptoCompare aggregates data from globally recognised exchanges, and seamlessly integrates different datasets to produce the asset price.
                            All prices are fed to the INVERSE platform via oracles from ChainLink and are updated every 1 minute. Initial staking price is determined at the moment of stake and Final staking price is determined during the last minute of the staking period.
                            Since the prices from CryptoCompare and by extension, the INVERSE platform, are derived from an aggregation of data from across different platforms, only these prices are relevant during the entire staking period. No other data, other than prices fed directly to the INVERSE platform will be used to determine wins and losses.

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </Wrapper>
    )
}

export default Faq
