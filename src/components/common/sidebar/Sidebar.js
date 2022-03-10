import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom'
import { Col, Form, Dropdown } from 'react-bootstrap'
import closeBtn from '../../../theme/images/sidebar_close.svg'
import darkcloseBtn from '../../../theme/images/close.png'
import MenuBtn from '../../../theme/images/sidebarMenu.svg'
import './SidebarStyle.css'


const Sidebar = (props) => {
    const toggleDropdown = async () => {
        var element1 = document.getElementsByClassName("sub-menu_sideBar")[0]
        element1.classList.toggle("opne_class");


        var elements = document.getElementsByClassName("sidebar_style")[0];
        if (document.getElementsByClassName('sub-menu_sideBar')[0].classList.contains('opne_class')) {
            elements.style['overflow-y'] = "visible";
        } else {
            elements.style['overflow-y'] = "auto";
        }
    }

    return (
        <Col className={`sidebar_style ${props.showNav ? 'extend_sidebar' : null}`}>
            <Col className="sidebar_buttonStyle">
                <Link onClick={props.onClickExtendSidebar} to={{ javascript: void (0) }} className="sidebar_menuBtn"><img src={MenuBtn} /></Link>
                {
                    props.showNav &&
                    <>   <Link className="sidebar_closeBtn dark_btn" to={{ javascript: void (0) }} onClick={props.onClickCollapseSidebar}><img src={closeBtn} /></Link>
                        <Link className="sidebar_closeBtn light_btn" to={{ javascript: void (0) }} onClick={props.onClickCollapseSidebar}><img src={darkcloseBtn} width="35" height="35" /></Link>
                    </>
                }
            </Col>
            <Col className="sidebar_navs">
                <ul>
                    {props.navLink.map((item, index) => {
                        return (
                            <li><NavLink className="sidebar_link" to={`/${item.navLink}`}>
                                <i className={`s_icon ${item.navItemClass}`}></i>
                                <span>{item.navText}</span></NavLink>
                            </li>
                        )
                    }
                    )}
                    <li>
                        {/* <Dropdown className="platform-dropdown">
                            <Dropdown.Toggle id="menu_nav">
                                <a className="sidebar_link" onClick={toggleDropdown}>
                                    <i className="s_icon i_platform"></i>
                                    <span>Platforms</span>
                                </a>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown__menu">
                                <Dropdown.Item href={`https://bridge.projectinverse.com/eth`} target="blank">Lightening Bridge </Dropdown.Item>
                                <Dropdown.Item href="https://vaultpass.projectinverse.com/" target="blank" >Vault Pass </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> */}
                        <a className="sidebar_link" href="javascript:void(0);" onClick={toggleDropdown}>
                            <i className="s_icon i_platform"></i>
                            <span>Platforms</span>
                        </a>
                        <ul className="sub-menu_sideBar">
                            <li>
                                <a href={`https://bridge.ferrum.network/frm/?currency=0x44f262622248027f8e2a8fb1090c4cf85072392c`} target="blank">XIV Bridge</a>
                            </li>
                            <li>
                                <a href={`https://vaultpass.projectinverse.com/`} target="blank">Vault Pass </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </Col>
            <Col className="sidebar_footer">




                {/* <a className="moonIcon" onClick={toggleTheme}>
                    <Form className="toggle-switch">
                        <Form.Check
                            className={`switch-btn   ? 'moonIcon' onClick={toggleTheme} : 'sunIcon' }`}
                            type="switch"
                            id="switchEnabled"
                        />
                    </Form>
                </a> */}

                {/* <div className="custom-control custom-switch">
                    <input type="checkbox" id="custom-switch-theme" className="custom-control-input" />
                    <label title="" for="custom-switch-theme" className="custom-control-label" onClick={toggleTheme}></label>
                </div> */}


            </Col>
        </Col>
    )
}

export default Sidebar
