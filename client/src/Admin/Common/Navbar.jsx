import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance, BASE_URL } from "../../Config";
import Swal from "sweetalert2";
import { Lock, LogOut } from "react-feather";

function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const bodyRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    bodyRef.current = document.body;
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axiosInstance.get(`/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.body) {
          const { image, name, email } = response.data.body;
          setImage(`${BASE_URL}/${image}`);
          setName(name);
          setEmail(email);
        }
      } catch (error) {}
    };

    fetchProfile();

    if (location.state?.updated) {
      fetchProfile();
    }
  }, [location.state]);

  const handleClick = () => {
    toggleSidebar();

    if (bodyRef.current) {
      const body = bodyRef.current;
      body.classList.toggle("sidebar-enable");

      body.classList.remove("hovered");

      if (window.innerWidth >= 1200) {
        body.classList.toggle("vertical-collapsed");
      } else {
        body.classList.remove("vertical-collapsed");
      }
    }
  };

  const closeDropdown = () => {
    if (dropdownRef.current) {
      const dropdown = window.bootstrap.Dropdown.getInstance(
        dropdownRef.current,
      );
      if (dropdown) {
        dropdown.hide();
      }
    }
  };

  const handleProfileClick = () => {
    closeDropdown();
    navigate("/profile");
  };

  const navigate = useNavigate();

  const logout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/logout`);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {}
    }
  };

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center" id="nav-first">
              <button
                type="button"
                className="btn btn-sm vertical-menu-btn"
                onClick={handleClick}
              >
                <i className="fe-menu"></i>
              </button>

              <Link to="/dashboard" className="new-logo">
                <img src="./src/assets/images/logo-new.png" alt="" />
              </Link>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown d-inline-block d-lg-none ms-2 me-2">
              <button
                type="button"
                className="btn header-item search-icon px-2"
                id="page-header-search-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="uil-search" />
              </button>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-start search-dropdown p-0"
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="m-0">
                    <div className="input-group nwoues">
                      <input
                        type="text"
                        className="form-control"
                        id="infoeu"
                        placeholder="Search name, phone number, email, ticket number..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                      <div className="opensrc">
                        <i className="ri-search-line" />
                      </div>
                      <div className="opencls">
                        <i className="ri-close-line" />
                      </div>
                    </div>
                    <div className="serach-result mt-2 ps-1">
                      <div className="srttl mb-2 font-size-12 text-muted">
                        POPULAR SEARCHES
                      </div>
                      <Link to="/" className="sritm mb-1">
                        <span className="text-lowdark">Name</span>
                      </Link>
                      <Link to="/" className="sritm mb-1">
                        <span className="text-lowdark">Phone Number</span>
                      </Link>
                      <Link to="/" className="sritm mb-1">
                        <span className="text-lowdark">Email</span>
                      </Link>
                      <Link to="/" className="sritm mb-1">
                        <span className="text-lowdark">Ticket#</span>
                      </Link>
                      <div className="srttl mb-2 mt-3 font-size-12 text-muted">
                        PAGES
                      </div>
                      <Link to="/" className="sritm mb-1">
                        <i className="text-lowdark ri-calendar-line me-1" />{" "}
                        <span className="text-lowdark">Calender</span>
                      </Link>
                      <Link to="/" className="sritm mb-1">
                        <i className="text-lowdark ri-file-text-line me-1" />{" "}
                        <span className="text-lowdark">Invoice List</span>
                      </Link>
                      <Link to="/" className="sritm mb-1">
                        <i className="text-lowdark ri-settings-3-line me-1" />{" "}
                        <span className="text-lowdark">Account Settings</span>
                      </Link>
                    </div>
                    <div className="src-empty">
                      <div className="text-center">
                        <svg
                          width={54}
                          height={54}
                          viewBox="0 0 54 54"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1.54083L53 53M12.8612 2.34155C18.0768 0.776507 33.0216 0.461939 41.8824 2.03478C44.0274 2.41694 46.0944 3.8 47.2228 5.63541C49.1104 8.7109 49.009 12.2907 49.009 15.8836L48.697 37.8643M6.2 6.64931C4.5568 12.5429 4.7778 23.3604 4.8844 39.328C4.9 41.3818 4.9962 43.4616 5.615 45.4244C6.5744 48.4661 8.1708 50.3119 11.6782 51.7937C13.1732 52.4281 14.8138 52.636 16.444 52.636H26.9558C36.8254 52.3969 40.8086 51.3674 45.1714 45.6739M23.0662 52.636C29.2568 49.4982 32.447 49.0614 31.6358 41.1686C31.4798 39.1252 32.6498 36.6841 34.7402 36.0289M48.853 27.117C48.2212 30.8503 47.7974 32.2385 45.278 34.3989"
                            stroke="#212529"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mb-0 mt-3 font-size-15">
                          No results found
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Profile */}
            <div className="dropdown d-inline-block">
              <button
                ref={dropdownRef}
                type="button"
                className="btn header-item waves-effect d-flex align-items-center"
                id="page-header-user-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  className="header-profile-user"
                  src={image || "assets/images/users/avatar-4.jpg"}
                  alt="Profile Avatar"
                />
                <div className="text-start d-none d-xl-inline-block ms-2 me-2">
                  <span className="fw-medium font-size-15 nsuser">
                    {name}
                    <i className="uil-angle-down namearr" />
                  </span>
                  <small className="text-muted d-block">Admin</small>
                </div>
              </button>
              <div className="dropdown-menu pt-3 pb-2 dropdown-menu-end dropdown-profile">
                <div className="innerdrop">
                  <div
                    className="px-3 pb-1"
                    style={{ cursor: "pointer" }}
                    onClick={handleProfileClick}
                  >
                    <div
                      className="font-size-14 text-muted mb-2"
                      style={{ display: "flex", alignItems: "baseline" }}
                    >
                      <span className="fw-medium me-1">Welcome</span>{" "}
                      <small
                        className="font-size-13 text-truncate"
                        style={{
                          maxWidth: 200,
                          display: "inline-block",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {name}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <img
                        src={image || "assets/images/users/avatar-4.jpg"}
                        alt=""
                        width={70}
                        height={70}
                        style={{ borderRadius: "50%" }}
                      />
                      <div
                        className="ms-3"
                        style={{ maxWidth: "calc(100% - 80px)" }}
                      >
                        <div
                          className="fw-semibold usprname text-truncate"
                          style={{
                            lineHeight: "1.3",
                            maxWidth: "100%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {name}
                        </div>
                        <div
                          className="text-lowdark pb-1 usprmail text-truncate"
                          style={{
                            maxWidth: "100%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {email}
                        </div>
                        <Link
                          to="/profile"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeDropdown();
                            navigate("/profile");
                          }}
                        >
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="dropplink font-size-15 mt-2">
                    {/* <Link
                      to="/profile"
                      className="d-block text-lowdark pb-2 ps-3 pt-2"
                      style={{ borderTop: "1px solid #e9ecf0" }}
                      onClick={closeDropdown}
                    >
                      <Edit
                        className="align-middle me-1"
                        style={{ fontSize: "10px" }}
                      />
                      <span>Profile Settings</span>
                    </Link> */}
                    <Link
                      to="/password"
                      className="d-block text-lowdark pb-2 ps-3 pt-2"
                      style={{ borderTop: "1px solid #e9ecf0" }}
                      onClick={closeDropdown}
                    >
                      <Lock className="align-middle font-size-10 me-1" />
                      <span>Password</span>
                    </Link>
                    <Link
                      to="/"
                      className="d-block text-danger ps-3 pt-2"
                      style={{ borderTop: "1px solid #e9ecf0" }}
                      onClick={(e) => {
                        e.preventDefault();
                        closeDropdown();
                        logout();
                      }}
                    >
                      <LogOut
                        className="align-middle me-1"
                        style={{ fontSize: "10px" }}
                      />
                      <span className="font-size-15">Logout</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
export default Navbar;
