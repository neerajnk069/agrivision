import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { BASE_URL, axiosInstance } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const limit = 10;

  const dateFilters = [
    { value: "all", label: "All Data" },
    { value: "7", label: "Last 7 Days" },
    { value: "30", label: "This Month" },
    { value: "180", label: "Last 6 Months" },
    { value: "365", label: "Last Year" },
  ];

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const fetchUsers = async (page, search = "", filter = "all") => {
    try {
      const response = await axiosInstance.get(
        `/userlist?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );
      if (response.data.success) {
        setUsers(response.data.body.data || []);
        setTotalPages(response.data.body.totalPages);
      } else {
      }
    } catch (error) {}
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const deleteUserHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/userdelete/${id}`);

        const response = await axiosInstance.get(
          `/userlist?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
            searchTerm,
          )}&dateFilter=${dateFilter}`,
        );

        if (response.data.success) {
          const newTotalPages = response.data.body.totalPages;
          const newData = response.data.body.data;

          if (newData.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            setUsers(newData);
            setTotalPages(newTotalPages);
          }
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting user",
          "error",
        );
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "0" ? "1" : "0";
      await axiosInstance.post("/userstatus", {
        id,
        status: newStatus,
      });

      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user,
        ),
      );

      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const getCurrentFilterLabel = () => {
    const filter = dateFilters.find((f) => f.value === dateFilter);
    return filter ? filter.label : "All Data";
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">User List</h4>
                <nav aria-label="breadcrumb" className="mt-1">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard" className="new">
                        <i className="ri-home-4-fill me-1 new" /> Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/" className="new">
                        <i className="ri-group-2-line me-1 new" /> Users
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      User Listings
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="card">
                <div className="card-body cusbar">
                  <div
                    className="card-head justify-content-start adjusttwo mb-3"
                    style={{ flexWrap: "nowrap" }}
                  >
                    <div className="tbl-search position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line" />
                    </div>

                    <div className="dropdown tbl-drop mb-3">
                      <button
                        className="btn btn-light dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {getCurrentFilterLabel()}
                      </button>
                      <ul className="dropdown-menu">
                        {dateFilters.map((filter) => (
                          <li key={filter.value}>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handleDateFilter(filter.value)}
                            >
                              {filter.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive table-card border-top">
                        <div data-simplebar="" className="cus-scroll scmob">
                          <table className="table table-centered cus-nowrap align-middle hltr mb-0">
                            <thead>
                              <tr>
                                <th>Sr no.</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th className="text-end">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.length > 0 ? (
                                users.map((user, index) => (
                                  <tr key={user.id}>
                                    <td>
                                      {(currentPage - 1) * limit + index + 1}
                                    </td>
                                    <td>
                                      {user.image ? (
                                        <a
                                          href={`${BASE_URL}/${user.image}`}
                                          data-fancybox="user-gallery"
                                          data-caption={
                                            user.name || "User Image"
                                          }
                                        >
                                          <img
                                            src={`${BASE_URL}/${user.image}`}
                                            alt="User"
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                              borderRadius: "50%",
                                              cursor: "pointer",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </a>
                                      ) : (
                                        "No Image"
                                      )}
                                    </td>
                                    <td>{user.name || ""}</td>
                                    <td>{user.email || ""}</td>
                                    <td>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`toggleStatus${user.id}`}
                                          checked={user.status === "1"}
                                          onChange={() =>
                                            toggleStatus(user.id, user.status)
                                          }
                                          style={{
                                            backgroundColor:
                                              user.status === "1"
                                                ? "#bb2d3b"
                                                : "lightgray",
                                            borderColor:
                                              user.status === "1"
                                                ? "#bb2d3b"
                                                : "lightgray",
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-end">
                                        <button
                                          type="button"
                                          className="btn btn-soft-primary px-2 btn-sm me-1"
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#view-details"
                                          aria-controls="offcanvasRight"
                                          onClick={() =>
                                            handleViewDetails(user)
                                          }
                                        >
                                          <i className="ri-eye-fill font-size-16"></i>
                                        </button>
                                        <button
                                          onClick={() =>
                                            deleteUserHandler(user.id)
                                          }
                                          className="btn btn-soft-danger px-2 btn-sm"
                                          style={{
                                            backgroundColor: "#ea5455",
                                            borderColor: "#ea5455",
                                            color: "#fff",
                                          }}
                                          title="Delete User"
                                        >
                                          <i className="ri-delete-bin-line font-size-16"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="7"
                                    style={{
                                      textAlign: "center",
                                      padding: "20px",
                                    }}
                                  >
                                    No users found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <div className="d-flex justify-content-center align-items-center mt-3">
                            <Stack
                              spacing={2}
                              className="d-flex justify-content-center mt-3"
                            >
                              <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="error"
                              />
                            </Stack>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Offcanvas - Keep this section exactly as it was */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <h5
                className="offcanvas-title mb-0 me-3 fw-semibold"
                id="offcanvasRightLabel"
              >
                User Details
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          {selectedUser ? (
            <>
              <div className="scroll-room mb-3" id="scrollRoom">
                {selectedUser.image ? (
                  <a
                    href={`${BASE_URL}/${selectedUser.image}`}
                    data-fancybox="gallery"
                    className="image-popup-gallery-item"
                  >
                    <img
                      src={`${BASE_URL}/${selectedUser.image}`}
                      className="img-fluid rounded"
                      alt="User"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">No Image Available</span>
                  </div>
                )}
              </div>
              <div>
                <div className="border-bottom mb-2 pb-1">
                  <h5 className="fw-semibold font-size-17 mb-1">
                    {selectedUser.name || "No Name"}
                  </h5>
                  <div className="mb-2">
                    <span className="text-primary fw-semibold font-size-18">
                      {selectedUser.status === "1" ? "Active" : "Inactive"}
                    </span>
                    <span
                      className="text-muted mx-2 border border-right"
                      style={{
                        borderColor: "#B9CAE2 !important",
                        marginRight: "12px !important",
                      }}
                    ></span>
                    <span className="text-muted">Member Since:</span>
                    <span className="text-primary fw-semibold font-size-18 ms-1">
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).getFullYear()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center border-bottom pt-1 pb-3">
                  {selectedUser.image ? (
                    <img
                      src={`${BASE_URL}/${selectedUser.image}`}
                      className="rounded-circle me-3"
                      width="100"
                      height="100"
                      alt="User Avatar"
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: "100px", height: "100px" }}
                    >
                      <i className="ri-user-line font-size-20 text-muted"></i>
                    </div>
                  )}
                  <div>
                    <div className="d-flex align-items-center position-relative mb-1">
                      <span className="me-2">Name</span>
                      <span className="line-circle"></span>
                      <span className="ms-2 font-size-15 fw-semibold">
                        {selectedUser.name || "No Name"}
                      </span>
                    </div>
                    <div className="d-flex align-items-center position-relative mb-1">
                      <span className="me-2">
                        Email: {selectedUser.email || "No Email"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="font-size-16 fw-medium pt-3 mt-1 mb-2">
                User Information
              </div>
              <table
                className="table table-borderless"
                style={{ marginLeft: "-8px" }}
              >
                <tbody>
                  <tr>
                    <td>User ID :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedUser.id}
                    </td>
                  </tr>
                  <tr>
                    <td>Name :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedUser.name || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Email :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedUser.email || ""}
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Gender:</td>
                    <td className="text-end text-black fw-medium">
                      {selectedUser.gender === "0"
                        ? "Male"
                        : selectedUser.gender === "1"
                          ? "Female"
                          : selectedUser.gender === "2"
                            ? "Other"
                            : "Not specified"}
                    </td>
                  </tr> */}
                  <tr>
                    <td>Mobile :</td>
                    <td className="text-end text-black fw-medium">
                      {/* {selectedUser?.countryCode || ""}{" "} */}
                      {selectedUser?.phoneNumber || ""}
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Location :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedUser?.location || ""}
                    </td>
                  </tr> */}
                  <tr>
                    <td>Status :</td>
                    <td className="text-end text-black fw-medium">
                      <span
                        className={`badge ${
                          selectedUser.status === "1"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {selectedUser.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* <div className="mt-4">
                <div className="font-size-16 fw-medium mb-3">Bio</div>
                <div className="card">
                  <div className="card-body p-3">
                    <textarea
                      className="form-control border-0 bg-transparent"
                      rows="5"
                      readOnly
                      value={selectedUser.bio || "No bio available"}
                      style={{
                        resize: "none",
                        overflowY: "auto",
                        cursor: "default",
                        minHeight: "120px",
                      }}
                    />
                  </div>
                </div>
              </div> */}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No user selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserList;
