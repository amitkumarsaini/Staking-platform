import { useEffect, useState, useRef } from "react";
import { Link, useLocation  } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { rootName } from "../../../constant";
import '../sidebarAdmin/SidebarAdminStyle.css'
import inverseLogo from '../../../theme/images/inverse_logo.svg'
import { FaDollarSign, FaHorseHead, FaPaperclip, FaCog } from 'react-icons/fa';

const SidebarAdmin = (props) => {
    const [selectedOption, setSelectedOption] = useState("");
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    console.log("Sidebar console" + pathname);


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
                    <SubMenu 
                        title="Set Currencies"  
                        icon={<FaDollarSign />}
                    >
                        <SubMenu
                            title="Defi Coins"
                            icon={<FaDollarSign />}
                            >
                            <SubMenu 
                                title="Individual" 
                                open={selectedOption === "Individual"}
                                onOpenChange={() => setSideBarOption("Individual")}
                            >
                                <MenuItem 
                                className={splitLocation[1] === "set-currencies" ? "active" : ""}>
                                    <Link to={`${rootName}set-currencies`}>Fixed</Link>
                                </MenuItem>
                                <MenuItem>Flexible</MenuItem>
                            </SubMenu>    
                            <MenuItem>Index</MenuItem>
                        </SubMenu> 
                        <SubMenu 
                            title="Chain Coins"
                            open={selectedOption === "Chain Coins"}
                            onOpenChange={() => setSideBarOption("Chain Coins")}
                        >
                            <SubMenu title="Individual" 
                                open={selectedOption === "Individual"}
                                onOpenChange={() => setSideBarOption("Individual")}
                            >
                                <MenuItem>Fixed</MenuItem>
                                <MenuItem>Flexible</MenuItem>
                            </SubMenu>    
                            <MenuItem>Index</MenuItem>
                        </SubMenu> 
                        <SubMenu 
                            title="NFT Coins"
                            open={selectedOption === "NFT Coins"}
                            onOpenChange={() => setSideBarOption("NFT Coins")}
                        >
                            <SubMenu 
                                title="Individual"
                                open={selectedOption === "Individual"}
                                onOpenChange={() => setSideBarOption("Individual")}
                            >
                                <MenuItem>Fixed</MenuItem>
                                <MenuItem>Flexible</MenuItem>
                            </SubMenu>    
                            <MenuItem>Index</MenuItem>
                        </SubMenu>                                               
                    </SubMenu>
                    <SubMenu  
                        title="Manage Flexible Bet Time"
                        icon={<FaHorseHead />}
                        open={selectedOption === "Manage Flexible Bet Time"}
                        onOpenChange={() => setSideBarOption("Manage Flexible Bet Time")}
                    >
                            <MenuItem className={splitLocation[1] === "manage-time-index" ? "active" : ""}><Link to={`${rootName}manage-time-individual`}>Individual</Link></MenuItem>
                            <MenuItem className={splitLocation[1] === "manage-time-individual" ? "active" : ""}><Link to={`${rootName}manage-time-index`}>Index</Link></MenuItem>
                    </SubMenu>
                    <SubMenu 
                        title="Manage Plans"
                        icon={<FaPaperclip />}
                        open={selectedOption === "Manage Plans"}
                        onOpenChange={() => setSideBarOption("Manage Plans")}
                    >
                        <SubMenu 
                            title="Fixed" 
                            open={selectedOption === "Fixed"}
                            onOpenChange={() => setSideBarOption("Fixed")}
                            >
                            <MenuItem className={splitLocation[1] === "manage-fixed-individual-plan" ? "active" : ""}>
                                <Link to={`${rootName}manage-fixed-individual-plan`}>Individual</Link>    
                            </MenuItem>
                            <MenuItem className={splitLocation[1] === "manage-fixed-index-plan" ? "active" : ""}>
                                <Link to={`${rootName}manage-fixed-index-plan`}>Index</Link>   
                            </MenuItem>
                        </SubMenu>
                        <SubMenu 
                            title="Flexible" 
                            open={selectedOption === "Flexible"}
                            onOpenChange={() => setSideBarOption("Flexible")}
                            >
                            <MenuItem className={splitLocation[1] === "manage-flexible-individual-plan" ? "active" : ""}>
                                <Link to={`${rootName}manage-flexible-individual-plan`}>Individual</Link> 
                            </MenuItem>
                            <MenuItem className={splitLocation[1] === "manage-flexible-index-plan" ? "active" : ""}>
                                <Link to={`${rootName}manage-flexible-index-plan`}>Index</Link> 
                            </MenuItem>
                        </SubMenu>
                    </SubMenu>
                    <MenuItem 
                        icon={<FaDollarSign />}
                        className={splitLocation[1] === "manage-penalty" ? "active" : ""}>
                        <Link to={`${rootName}manage-penalty`}>Manage Penality</Link> 
                    </MenuItem>
                    <MenuItem
                        icon={<FaCog />}
                        className={splitLocation[1] === "manage-settings" ? "active" : ""}>
                        <Link to={`${rootName}manage-settings`}>Settings</Link>
                    </MenuItem>
            </Menu>
            </ProSidebar>
    )
}

export default SidebarAdmin
