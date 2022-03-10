import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { rootName } from "../../../../constant";
import "./SidebarAdminStyle.css";
import inverseLogo from "../../../../theme/images/inverse_logo.svg";
import { FaDollarSign, FaHorseHead, FaPaperclip, FaCog } from "react-icons/fa";

const AdminSidebar = (props) => {
  const [selectedOption, setSelectedOption] = useState("");
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const setSideBarOption = (option) => {
    if (selectedOption === option) {
      setSelectedOption("");
    } else {
      if (props.showSocial) {
        // if (!isMobile) {
        //   props.closeSidebar();
        // }
      }
      setSelectedOption(option);
      console.log("setSelectedOption(option); called");
    }
  };

  useEffect(() => {
    if (props.showSocial) {
      setSelectedOption("");
    }
  }, [props.showSocial]);

  return (
    <ProSidebar>
      <SidebarHeader>
        <img src={inverseLogo} />
      </SidebarHeader>
      <Menu iconShape="circle">
        <SubMenu title="Set Currencies" icon={<FaDollarSign />}>
          <SubMenu title="Defi Coins" icon={<FaDollarSign />}>
            <SubMenu
              title="Individual"
              open={selectedOption === "Defi-Individual"}
              onOpenChange={() => setSideBarOption("Defi-Individual")}
            >
              <MenuItem
                className={
                  splitLocation[1] === "set-currencies" ? "active" : ""
                }
              >
                <Link to={`/admin/dashboard/defi/individual/fixed`}>Fixed</Link>
              </MenuItem>
              <MenuItem>
                <Link to={`/admin/dashboard/defi/individual/flexible`}>
                  Flexible
                </Link>
              </MenuItem>
            </SubMenu>
            {/* <MenuItem><Link to="/admin/dashboard/chain/index">Index</Link></MenuItem> */}
          </SubMenu>
          <SubMenu title="Chain Coins" icon={<FaDollarSign />}>
            <SubMenu
              title="Individual"
              open={selectedOption === "Chain-Individual"}
              onOpenChange={() => setSideBarOption("Chain-Individual")}
            >
              <MenuItem
                className={
                  splitLocation[1] === "set-currencies" ? "active" : ""
                }
              >
                <Link to={`/admin/dashboard/chain/individual/fixed`}>
                  Fixed
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to={`/admin/dashboard/chain/individual/flexible`}>
                  Flexible
                </Link>
              </MenuItem>
            </SubMenu>
            {/* <MenuItem><Link to="/admin/dashboard/chain/index">Index</Link></MenuItem> */}
          </SubMenu>
          <SubMenu title="NFT Coins" icon={<FaDollarSign />}>
            <SubMenu
              title="Individual"
              open={selectedOption === "NFT-Individual"}
              onOpenChange={() => setSideBarOption("NFT-Individual")}
            >
              <MenuItem
                className={
                  splitLocation[1] === "set-currencies" ? "active" : ""
                }
              >
                <Link to={`/admin/dashboard/nft/individual/fixed`}>Fixed</Link>
              </MenuItem>
              <MenuItem>
                <Link to={`/admin/dashboard/nft/individual/flexible`}>
                  Flexible
                </Link>
              </MenuItem>
            </SubMenu>
            {/* <MenuItem><Link to="/admin/dashboard/nft/index">Index</Link></MenuItem> */}
          </SubMenu>
        </SubMenu>

        <SubMenu
          title="Manage Flexible Bet Time"
          icon={<FaHorseHead />}
          open={selectedOption === "Manage Flexible Bet Time"}
          onOpenChange={() => setSideBarOption("Manage Flexible Bet Time")}
        >
          <MenuItem
            className={splitLocation[1] === "set-currencies" ? "active" : ""}
          >
            <Link to={`/admin/dashboard/manage-time-individual`}>
              Individual
            </Link>
          </MenuItem>
          {/* <MenuItem><Link to={`/admin/dashboard/manage-time-index`}>Index</Link></MenuItem> */}
        </SubMenu>
        <SubMenu title="Manage Plans" icon={<FaPaperclip />}>
          <SubMenu title="Fixed" icon={<FaDollarSign />}>
            <MenuItem
              className={splitLocation[1] === "set-currencies" ? "active" : ""}
            >
              <Link to={`/admin/dashboard/manage-fixed-individual-plan`}>
                Individual
              </Link>
            </MenuItem>
            {/* <MenuItem><Link to={`/admin/dashboard/manage-fixed-index-plan`}>Index</Link></MenuItem> */}
          </SubMenu>
          <SubMenu title="Flexible" icon={<FaDollarSign />}>
            <MenuItem
              className={splitLocation[1] === "set-currencies" ? "active" : ""}
            >
              <Link to={`/admin/dashboard/manage-flexible-individual-plan`}>
                Individual
              </Link>
            </MenuItem>
            {/* <MenuItem><Link to={`/admin/dashboard/manage-flexible-index-plan`}>Index</Link></MenuItem> */}
          </SubMenu>
        </SubMenu>
        <MenuItem
          icon={<FaDollarSign />}
          className={splitLocation[1] === "manage-penalty" ? "active" : ""}
        >
          <Link to={`/admin/dashboard/manage-penalty`}>Manage Penality</Link>
        </MenuItem>
        <MenuItem
          icon={<FaCog />}
          className={splitLocation[1] === "manage-settings" ? "active" : ""}
        >
          <Link to={`/admin/dashboard/manage-settings`}>Settings</Link>
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default AdminSidebar;
