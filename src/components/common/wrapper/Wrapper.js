import React, { useState } from "react";
import { Col, Container } from "react-bootstrap";
import Sidebar from "../sidebar/Sidebar";
import SidebarAdmin from "../sidebarAdmin/SidebarAdmin";
import NavbarTop from "../navbarTop/NavbarTop";
import "./WrapperStyle.css";
import footericon from '../../../theme/images/footer_icon.png'
import { NavLink, Link } from 'react-router-dom'

const Wrapper = (props) => {
  const [showNav, setShowNav] = useState(false);
  const onClickExtendSidebar = () => {
    setShowNav(true);
  };
  const onClickCollapseSidebar = () => {
    setShowNav(false);
  };
  const navList = [
    {
      navText: "My Dashboard",
      navLink: "dashboard",
      navItemClass: "i_dashboard",
    },
    {
      navText: "Inverse Staking",
      navLink: "Inversestaking",
      navItemClass: "i_inlinestaking",
    },
    {
      navText: "Inline Staking",
      navLink: "Inlinestaking",
      navItemClass: "i_staking",
    },
    // {
    //   navText: "Swap",
    //   navLink: "swap",
    //   navItemClass: "i_swap",
    // },
    {
      navText: "Liquidity",
      navLink: "liquidity",
      navItemClass: "i_liquidity",
    },
    {
      navText: "FAQ",
      navLink: "faq",
      navItemClass: "i_faq",
    },
    {
      navText: "User Rank",
      navLink: "Userrank",
      navItemClass: "i_rank",
    },
    // {
    //   navText: "Platforms",
    //   navLink: "Platforms",
    //   navItemClass: "i_platform",
    // },
  ];
  return (
    <Container className={`mainwrapper ${props.className}`} fluid>
      {!props.admin_wrap ? (
        <Sidebar
          navLink={navList}
          onClickExtendSidebar={onClickExtendSidebar}
          onClickCollapseSidebar={onClickCollapseSidebar}
          showNav={showNav}
        />
      ) : (
        <SidebarAdmin />
      )}

      <Container fluid className="contentWrapper_main">
        <NavbarTop />
        <Col className="contentWrapper">{props.children}</Col>
        <Col className="footer_container">
          <p><i class="fa fa-envelope" aria-hidden="true"></i> <a class="" href="mailto:info@projectinverse.com">info@projectinverse.com</a> <img src={footericon} /> Copyright © {new Date().getFullYear()} Inverse. All rights reserved. <span className="footer-subline">Powered By XIV</span></p>
          <NavLink to={`/Privacypolicy`}>Privacy Policy</NavLink>
          <a class="" href="#">|</a>
          <NavLink to={`/Terms`}>Terms of Services</NavLink>
        </Col>
      </Container>
    </Container>
  );
};

export default Wrapper;
