import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  CheckSquare,
  File,
  Info,
  Phone,
  MessageSquare,
} from "react-feather";

function Sidebar({ isOpen }) {
  const [isHovered, setHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();
  const { pathname } = location;

  const handleMouseEnter = () => {
    if (!isOpen) {
      setHovered(true);
      setShowButton(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isOpen) {
      setHovered(false);
      setShowButton(false);
    }
  };

  const isSidebarExpanded = isOpen || isHovered;

  const toggleMenu = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    const width = window.innerWidth;
    if (width <= 1200) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    if (pathname.includes("/userlist")) {
      setActiveMenu("users");
    }
    if (pathname.includes("/agentlist")) {
      setActiveMenu("agent");
    }
    if (pathname.includes("/agricultureImagesList")) {
      setActiveMenu("agricultureimages");
    }
    if (pathname.includes("/agriculturelist")) {
      setActiveMenu("agriculture");
    }
    if (pathname.includes("/newslist")) {
      setActiveMenu("news");
    }
    if (pathname.includes("/servicelist")) {
      setActiveMenu("service");
    }
    if (pathname.includes("/faqlist")) {
      setActiveMenu("faq");
    } else if (pathname === "/teamlist") {
      setActiveMenu("teamManagement");
    } else if (pathname === "/userlist") {
      setActiveMenu("users");
    } else if (pathname === "/userlist") {
      setActiveMenu("users");
    } else if (pathname === "/bookinglist") {
      setActiveMenu("booking");
    } else if (pathname === "/chat") {
      setActiveMenu("chat");
    } else if (pathname === "/registerproduct") {
      setActiveMenu("registerproduct");
    } else if (pathname.includes("/faqlist")) {
      setActiveMenu("support");
    } else if (pathname.includes("/password")) {
      setActiveMenu("settings");
    } else {
      setActiveMenu(null);
    }
  }, [pathname]);

  return (
    <div
      className={`vertical-menu ${isSidebarExpanded ? "hovered" : "collapsed"}`}
      onMouseEnter={() => {
        handleMouseEnter();
        document.body.classList.add("hovered");
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        document.body.classList.remove("hovered");
      }}
    >
      <div className="navbar-brand-box">
        <Link to="/dashboard" className="logo" onClick={handleLinkClick}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="logo-lg">
              {/* <img src="/assets/images/fev1.png" alt="" height={20} /> */}
            </span>
            <h6 style={{ margin: 5, color: "black", fontSize: "26px" }}>
              Agrivision
            </h6>
          </div>
        </Link>
        <button
          type="button"
          className="btn btn-sm hide-menu-btn"
          onClick={() => {
            const body = document.body;
            body.classList.toggle("sidebar-enable");
            body.classList.remove("hovered");
            setHovered(false);
            setShowButton(false);

            if (window.innerWidth >= 1200) {
              body.classList.toggle("vertical-collapsed");
            } else {
              body.classList.remove("vertical-collapsed");
            }
          }}
          style={{
            display: isSidebarExpanded && showButton ? "block" : "none",
          }}
        >
          <i className="fe-x"></i>
        </button>
      </div>
      <div data-simplebar="" className="sidebar-menu-scroll mt-1">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className={isActive("/dashboard") ? "mm-active" : ""}>
              <Link to="/dashboard" onClick={handleLinkClick}>
                <i className="ri-pie-chart-2-fill" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className={activeMenu === "users" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("users")}
              >
                <i className="uil-user-square" />
                <span>Users</span>
              </Link>
              {isSidebarExpanded && activeMenu === "users" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/userlist") ? "active" : ""}
                      to="/userlist"
                      onClick={handleLinkClick}
                    >
                      User listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={activeMenu === "agent" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("agent")}
              >
                <i className="uil-users-alt" />
                <span>Agents</span>
              </Link>
              {isSidebarExpanded && activeMenu === "agent" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/agentlist") ? "active" : ""}
                      to="/agentlist"
                      onClick={handleLinkClick}
                    >
                      Agent listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={activeMenu === "agricultureimages" ? "mm-active" : ""}
            >
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("agricultureimages")}
              >
                <i className="fa-solid fa-images"></i>
                <span>Agricultures Images</span>
              </Link>
              {isSidebarExpanded && activeMenu === "agricultureimages" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={
                        isActive("/agricultureImagesList") ? "active" : ""
                      }
                      to="/agricultureImagesList"
                      onClick={handleLinkClick}
                    >
                      Agriculture Images list
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={activeMenu === "agriculture" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("agriculture")}
              >
                <i className="fa-solid fa-leaf"></i>
                <span>Agricultures</span>
              </Link>
              {isSidebarExpanded && activeMenu === "agriculture" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/agriculturelist") ? "active" : ""}
                      to="/agriculturelist"
                      onClick={handleLinkClick}
                    >
                      Agriculture listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={activeMenu === "news" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("news")}
              >
                <i className="uil-clipboard-alt" />

                <span>News</span>
              </Link>
              {isSidebarExpanded && activeMenu === "news" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/newslist") ? "active" : ""}
                      to="/newslist"
                      onClick={handleLinkClick}
                    >
                      News listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={activeMenu === "service" ? "mm-active" : ""}>
              <Link
                className="has-arrow waves-effect"
                onClick={() => toggleMenu("service")}
              >
                <i className="uil-briefcase-alt" />

                <span>Services</span>
              </Link>
              {isSidebarExpanded && activeMenu === "service" && (
                <ul className="sub-menu mm-show">
                  <li>
                    <Link
                      className={isActive("/servicelist") ? "active" : ""}
                      to="/servicelist"
                      onClick={handleLinkClick}
                    >
                      Service listings
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isActive("/contactlist") ? "mm-active" : ""}>
              <Link to="/contactlist" onClick={handleLinkClick}>
                <Phone />
                <span>Inquiry</span>
              </Link>
            </li>
            <li className={isActive("/faqlist") ? "mm-active" : ""}>
              <Link to="/faqlist" onClick={handleLinkClick}>
                <MessageSquare />
                <span>Faqs</span>
              </Link>
            </li>
            <li className={isActive("/aboutus") ? "mm-active" : ""}>
              <Link to="/aboutus" onClick={handleLinkClick}>
                <Info />
                <span>About Us</span>
              </Link>
            </li>

            <li className={isActive("/privacypolicy") ? "mm-active" : ""}>
              <Link to="/privacypolicy" onClick={handleLinkClick}>
                <File />
                <span>Privacy Policy</span>
              </Link>
            </li>

            <li className={isActive("/termsConditions") ? "mm-active" : ""}>
              <Link to="/termsConditions" onClick={handleLinkClick}>
                <CheckSquare />
                <span>Terms & Conditions</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
