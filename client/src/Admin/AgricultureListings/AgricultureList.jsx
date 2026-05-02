import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { BASE_URL, axiosInstance } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const AgricultureList = () => {
  const navigate = useNavigate();
  const [agricultures, setAgricultures] = useState([]);
  const [selectedAgriculture, setSelectedAgriculture] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");

  const limit = 10;

  const fetchagricultures = async (page = 1, search = "", filter = "all") => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/agricultureList?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );

      if (res.data.success) {
        setAgricultures(res.data.body.data || []);
        setTotalPages(res.data.body.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to fetch agricultures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchagricultures(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const truncateText = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  };

  const deleteAgriculture = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/deleteAgriculture/${id}`);
        toast.success("agriculture deleted successfully");
        fetchagricultures(currentPage, searchTerm, dateFilter);
      } catch (error) {
        toast.error("Failed to delete agricultures");
      }
    }
  };

  // const toggleStatus = async (id, currentStatus) => {
  //   try {
  //     const agriculturestatus = currentStatus == "1" ? "0" : "1";

  //     const res = await axiosInstance.post("/agriculturestatus", {
  //       id,
  //       status: agriculturestatus,
  //     });

  //     if (res.data.success) {
  //       setAgricultures((prev) =>
  //         prev.map((item) =>
  //           item.id === id ? { ...item, status: agriculturestatus } : item,
  //         ),
  //       );

  //       toast.success("Status updated successfully");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to update status");
  //   }
  // };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`/agriculture/status/${id}`, { status });

      setAgricultures((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchAgriculturesView = async (id) => {
    try {
      const res = await axiosInstance.get(`/viewAgriculture/${id}`);
      if (res.data.success) {
        setAgricultures(res.data.body);
      }
    } catch (error) {
      toast.error("Failed to load agricultures");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Agricultures List</h4>
                {/* <Link to="/addAgriculture" className="btn btn-primary btn-sm">
                Add Agriculture
              </Link> */}
              </div>

              <div className="card">
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search agricultures..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Agent Name</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Approved By</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : agricultures.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No agricultures Found
                            </td>
                          </tr>
                        ) : (
                          agricultures.map((item, index) => (
                            <tr key={item.id}>
                              <td>{(currentPage - 1) * limit + index + 1}</td>
                              <td>{item.agent?.name}</td>
                              <td>{item.title}</td>

                              <td style={{ maxWidth: "300px" }}>
                                {truncateText(item.description, 15)}
                              </td>
                              <td>Admin</td>
                              <td>
                                <select
                                  className="form-select"
                                  value={item.status}
                                  onChange={(e) =>
                                    handleStatusChange(item.id, e.target.value)
                                  }
                                >
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>

                              <td className="text-end">
                                <button
                                  className="btn btn-soft-primary btn-sm me-1"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#view-details"
                                  onClick={() => setSelectedAgriculture(item)}
                                >
                                  <i className="ri-eye-fill font-size-16"></i>
                                </button>

                                {/* <button
                                className="btn btn-warning btn-sm me-1"
                                onClick={() =>
                                  navigate(`/editAgriculture/${item.id}`)
                                }
                              >
                                Edit
                              </button> */}

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteAgriculture(item.id)}
                                >
                                  <i className="ri-delete-bin-line font-size-16"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <Stack
                      spacing={2}
                      className="mt-3 d-flex align-items-center"
                    >
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                      />
                    </Stack>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas for Agents Details */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="offcanvas-title mb-0 fw-semibold">
              Agriculture Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          {selectedAgriculture ? (
            <>
              <div className="border-bottom mb-3 pb-3">
                <label className="text-muted small">Agent Name</label>
                <h5 className="fw-semibold mb-2">
                  {selectedAgriculture.agent?.name || "No Name"}
                </h5>
              </div>

              <div className="mb-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="text-muted small">Title</label>
                    <p className="fw-medium">
                      {selectedAgriculture.title || "N/A"}
                    </p>
                  </div>
                  <div className="mt-3">
                    <div className="font-size-16 fw-medium mb-2">
                      Description:
                    </div>
                    <div className="bg-light">
                      {selectedAgriculture.description ? (
                        <textarea
                          readOnly
                          className="form-control"
                          rows="10"
                          value={selectedAgriculture.description}
                          style={{
                            resize: "none",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid black",
                          }}
                        />
                      ) : (
                        "No description available"
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small">Approved By:</label>
                    <p className="fw-medium">
                      {selectedAgriculture.approved_by || "Admin"}
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small">Status:</label>
                    <p className="fw-medium">
                      {selectedAgriculture.status === "approved" ? (
                        <span className="badge bg-success">Approved</span>
                      ) : selectedAgriculture.status === "rejected" ? (
                        <span className="badge bg-danger">Rejected</span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No agriculture selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgricultureList;
