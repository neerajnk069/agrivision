import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { BASE_URL, axiosInstance } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const NewsList = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateFilter] = useState("all");

  const limit = 10;

  const fetchNews = async (page = 1, search = "", filter = "all") => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/newsList?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );

      if (res.data.success) {
        setNews(res.data.body.data || []);
        setTotalPages(res.data.body.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const truncateText = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  };

  const deleteNews = async (id) => {
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
        await axiosInstance.delete(`/deleteNews/${id}`);
        toast.success("News deleted successfully");
        fetchNews(currentPage, searchTerm, dateFilter);
      } catch (error) {
        toast.error("Failed to delete news");
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "1" ? "0" : "1";

      const res = await axiosInstance.post("/newStatus ", {
        id,
        status: newStatus,
      });

      if (res.data.success) {
        setNews((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item,
          ),
        );

        toast.success("Status updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>News List</h4>
                <Link to="/addNews" className="btn btn-primary btn-sm">
                  Add News
                </Link>
              </div>

              <div className="card">
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Description</th>
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
                        ) : news.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No News Found
                            </td>
                          </tr>
                        ) : (
                          news.map((item, index) => (
                            <tr key={item.id}>
                              <td>{(currentPage - 1) * limit + index + 1}</td>

                              <td>
                                {item.image ? (
                                  <a
                                    href={`${BASE_URL}/${item.image}`}
                                    data-fancybox="gallery"
                                  >
                                    <img
                                      src={`${BASE_URL}/${item.image}`}
                                      alt="news"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </a>
                                ) : (
                                  "No Image"
                                )}
                              </td>

                              <td>{item.title}</td>

                              <td style={{ maxWidth: "300px" }}>
                                {truncateText(item.content, 15)}
                              </td>

                              <td>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={item.status === "1"}
                                    onChange={() =>
                                      toggleStatus(item.id, item.status)
                                    }
                                  />
                                </div>
                              </td>

                              <td className="text-end">
                                <button
                                  className="btn btn-soft-primary btn-sm me-1"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#view-details"
                                  onClick={() => setSelectedNews(item)}
                                >
                                  <i className="ri-eye-fill font-size-16"></i>
                                </button>

                                <button
                                  className="btn btn-warning btn-sm me-1"
                                  onClick={() =>
                                    navigate(`/editNews/${item.id}`)
                                  }
                                >
                                  <i className="ri-edit-line text-white"></i>
                                </button>

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteNews(item.id)}
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

      {/* Offcanvas for News Details */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="offcanvas-title mb-0 fw-semibold">News Details</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          {selectedNews ? (
            <>
              <div className="scroll-room mb-3" id="scrollRoom">
                <label className="text-muted small">Image</label>

                {selectedNews.image ? (
                  <a
                    href={`${BASE_URL}/${selectedNews.image}`}
                    data-fancybox="gallery"
                    className="image-popup-gallery-item"
                  >
                    <img
                      src={`${BASE_URL}/${selectedNews.image}`}
                      className="img-fluid rounded"
                      alt="Provider"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300";
                      }}
                    />
                  </a>
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <i className="ri-user-line font-size-48 text-muted"></i>
                  </div>
                )}
              </div>

              <div className="border-bottom mb-3 pb-3">
                <label className="text-muted small">Title</label>
                <h5 className="fw-semibold mb-2">
                  {selectedNews.title || "No Title"}
                </h5>
              </div>

              <div className="mt-3">
                <div className="font-size-16 fw-medium mb-2">Description:</div>
                <div className="bg-light">
                  {selectedNews.content ? (
                    <textarea
                      readOnly
                      className="form-control"
                      rows="10"
                      value={selectedNews.content}
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
              <div className="col-6">
                <label className="text-muted small">Status</label>
                <p>
                  {selectedNews.status == "1" ? (
                    <span className="text-success">Active</span>
                  ) : (
                    <span className="text-danger">Inactive</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No news selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsList;
