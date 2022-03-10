import React from 'react'
import { Container } from 'react-bootstrap';
import Wrapper from '../../../common/wrapper/Wrapper';
import MainHeading from '../../../common/mainHeading/MainHeading';
import Swapcard from '../../../common/Swapcard/Swapcard';
import uniSwap_icon from '../../../../theme/images/uniSwap_icon.svg'
import pancakeSwap_icon from '../../../../theme/images/pancakeSwap_icon.svg'
import icon_copyAddress from '../../../../theme/images/icon_copyAddress.svg'
import { XIV } from "../../../../constant";

const swap = () => {
    return (
        <Wrapper>
            <Container className="faq" fluid>
                <MainHeading title="swap" />
                <Swapcard title="Uniswap" to="https://app.uniswap.org/#/swap" swap_icon={uniSwap_icon} text="To swap other tokens for XIV, please visit Uniswap by clicking the link and insert the contract address below in the Uniswap search bar." cont_add="XIV Contract Address:" code={XIV} copy_icon={icon_copyAddress} swap_btn="Go to Uniswap"></Swapcard>
                <Swapcard cstyle="panswap" to="https://exchange.pancakeswap.finance/#/swap" title="Pancakeswap" swap_icon={pancakeSwap_icon} text="To swap other tokens for XIV, please visit Pancake by clicking the link and insert the contract address below in the Pancake search bar." cont_add="XIV Contract Address:" code={XIV} copy_icon={icon_copyAddress} swap_btn="Go to Pancake"></Swapcard>
            </Container>
        </Wrapper>
    )
}

export default swap
