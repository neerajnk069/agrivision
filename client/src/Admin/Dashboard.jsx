import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../Config";
import "react-toastify/dist/ReactToastify.css";
import RevenueChart from "./ApexChart";

const Dashboard = () => {
  const [users, setUsers] = useState(0);
  const [agents, setProvider] = useState(0);
  const [inquiry, setBooking] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard");
        if (response.data.success) {
          const body = response.data.body;
          setUsers(body.users || 0);
          setProvider(body.agents || 0);
          setBooking(body.inquiry || 0);
          setTotalRevenue(body.totalRevenue || 0);
          setRevenueChange(body.revenueChange || 0);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleRevenueUpdate = (revenue) => {
    console.log("Total revenue from chart:", revenue);
  };

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="title-box mb-3 pb-1">
              <h4 className="mb-0 page-title">Dashboard</h4>
              <nav aria-label="breadcrumb" className="mt-1">
                <ol className="breadcrumb mb-0">
                  <Link to="/dashboard" className="new">
                    <i className="ri-home-4-fill me-1 new" /> Home
                  </Link>
                </ol>
              </nav>
            </div>

            <div className="row mb-4">
              {/* <div className="col-lg-3"> 
             <div className="mid-reponse h-50">
               Total Revenue Card 
               <div className="card keybg2 h-100">
                    <div className="card-body py-3">
                      <div className="float-end mt-2">
                        <div id="total-revenue-chart"></div>
                      </div>
                      <div>
                        <div className="key-1">Total Transaction</div>
                        <p className="text-blue fw-medium font-size-12 mb-0">
                          All Sources
                        </p>
                      </div>
                      <div
                        className="d-flex justify-content-between align-items-end"
                        style={{ marginTop: "30px" }}
                      >
                        <h6 className="key-2 my-0">
                          ${totalRevenue.toLocaleString()}
                        </h6>
                        <div className="text-end">
                          <span
                            className={`badge text-bg-primary font-size-13 fw-medium ps-1 ${revenueChange >= 0 ? "text-success" : "text-danger"}`}
                          >
                            <i
                              className={`ri-arrow-${revenueChange >= 0 ? "up" : "down"}-s-fill align-middle`}
                            ></i>
                            {Math.abs(revenueChange)}%
                          </span>
                          <p
                            className="mb-0 mt-1 text-muted font-size-13"
                            style={{ lineHeight: "1.14" }}
                          >
                            From last month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> 
              </div> 
              </div> */}

              <div className="col-lg-9">
                <div className="card key-matrix mb-0">
                  <div className="card-body pb-0">
                    <div className="card-head mb-3">
                      <div>
                        <div className="card-title mb-0">Metrics</div>
                      </div>
                    </div>
                    <div className="row gx-3">
                      {/* Users Card */}
                      <div className="col">
                        <div className="card bg-soft-blue">
                          <div
                            className="card-body"
                            style={{ paddingBottom: "13px", cursor: "pointer" }}
                            onClick={() => navigate("/userlist")}
                          >
                            <div className="icon-font">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16 17V19H2V17C2 17 2 13 9 13C16 13 16 17 16 17ZM12.5 7.50004C12.5 6.8078 12.2947 6.13111 11.9101 5.55554C11.5256 4.97997 10.9789 4.53137 10.3394 4.26646C9.69985 4.00155 8.99612 3.93224 8.31718 4.06729C7.63825 4.20234 7.01461 4.53568 6.52513 5.02516C6.03564 5.51465 5.7023 6.13829 5.56725 6.81722C5.4322 7.49615 5.50152 8.19989 5.76642 8.83943C6.03133 9.47897 6.47993 10.0256 7.0555 10.4102C7.63108 10.7948 8.30777 11 9 11C9.92826 11 10.8185 10.6313 11.4749 9.97491C12.1313 9.31853 12.5 8.42829 12.5 7.50004ZM15.94 13C16.5547 13.4758 17.0578 14.0805 17.4137 14.7715C17.7696 15.4626 17.9697 16.2233 18 17V19H22V17C22 17 22 13.37 15.94 13ZM15 4.00004C14.3118 3.99684 13.6388 4.20257 13.07 4.59004C13.6774 5.43877 14.0041 6.45632 14.0041 7.50004C14.0041 8.54375 13.6774 9.5613 13.07 10.41C13.6388 10.7975 14.3118 11.0032 15 11C15.9283 11 16.8185 10.6313 17.4749 9.97491C18.1313 9.31853 18.5 8.42829 18.5 7.50004C18.5 6.57178 18.1313 5.68154 17.4749 5.02516C16.8185 4.36879 15.9283 4.00004 15 4.00004Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <div>
                              <h5 className="mb-1 mt-2 fw-semibold">{users}</h5>
                              <p className="text-muted mb-1 fw-medium font-size-15 one-ellips">
                                Total Users
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Providers Card */}
                      <div className="col">
                        <div className="card bg-soft-blue">
                          <div
                            className="card-body"
                            style={{ paddingBottom: "13px", cursor: "pointer" }}
                            onClick={() => navigate("/agentlist")}
                          >
                            <div className="icon-font">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16 17V19H2V17C2 17 2 13 9 13C16 13 16 17 16 17ZM12.5 7.50004C12.5 6.8078 12.2947 6.13111 11.9101 5.55554C11.5256 4.97997 10.9789 4.53137 10.3394 4.26646C9.69985 4.00155 8.99612 3.93224 8.31718 4.06729C7.63825 4.20234 7.01461 4.53568 6.52513 5.02516C6.03564 5.51465 5.7023 6.13829 5.56725 6.81722C5.4322 7.49615 5.50152 8.19989 5.76642 8.83943C6.03133 9.47897 6.47993 10.0256 7.0555 10.4102C7.63108 10.7948 8.30777 11 9 11C9.92826 11 10.8185 10.6313 11.4749 9.97491C12.1313 9.31853 12.5 8.42829 12.5 7.50004ZM15.94 13C16.5547 13.4758 17.0578 14.0805 17.4137 14.7715C17.7696 15.4626 17.9697 16.2233 18 17V19H22V17C22 17 22 13.37 15.94 13ZM15 4.00004C14.3118 3.99684 13.6388 4.20257 13.07 4.59004C13.6774 5.43877 14.0041 6.45632 14.0041 7.50004C14.0041 8.54375 13.6774 9.5613 13.07 10.41C13.6388 10.7975 14.3118 11.0032 15 11C15.9283 11 16.8185 10.6313 17.4749 9.97491C18.1313 9.31853 18.5 8.42829 18.5 7.50004C18.5 6.57178 18.1313 5.68154 17.4749 5.02516C16.8185 4.36879 15.9283 4.00004 15 4.00004Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                            <div>
                              <h5 className="mb-1 mt-2 fw-semibold">
                                {agents}
                              </h5>
                              <p className="text-muted mb-1 fw-medium font-size-15 one-ellips">
                                Total Agents
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bookings Card */}
                      <div className="col">
                        <div className="card bg-soft-green">
                          <div
                            className="card-body"
                            style={{ paddingBottom: "13px", cursor: "pointer" }}
                            onClick={() => navigate("/contactlist")}
                          >
                            <div className="icon-font">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_240_1748)">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11 3.055C8.97114 3.28241 7.07978 4.19257 5.63618 5.63618C4.19257 7.07978 3.28241 8.97114 3.055 11H0V13H3.055C3.28241 15.0289 4.19257 16.9202 5.63618 18.3638C7.07978 19.8074 8.97114 20.7176 11 20.945V24H13V20.945C15.0289 20.7176 16.9202 19.8074 18.3638 18.3638C19.8074 16.9202 20.7176 15.0289 20.945 13H24V11H20.945C20.7176 8.97114 19.8074 7.07978 18.3638 5.63618C16.9202 4.19257 15.0289 3.28241 13 3.055V0H11V3.055ZM12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16ZM12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_240_1748">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div>
                              <h5 className="mb-1 mt-2 fw-semibold">
                                {inquiry}
                              </h5>
                              <p className="text-muted mb-1 fw-medium font-size-15 one-ellips">
                                Total Inquiry
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <RevenueChart onTotalRevenueUpdate={handleRevenueUpdate} />

            <div className="container-fluid">
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
