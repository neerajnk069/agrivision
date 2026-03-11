import React, { useEffect, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");

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
      // console.log(currentStatus, id, "bbbbbbbbbbbbbbbbbbbbbbbbb");

      const newStatus = currentStatus == 1 ? 0 : 1;

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
                                  checked={item.status == 1}
                                  onChange={() =>
                                    toggleStatus(item.id, item.status)
                                  }
                                />
                              </div>
                            </td>

                            <td className="text-end">
                              <button
                                className="btn btn-soft-primary btn-sm me-1"
                                onClick={() => navigate(`/viewNews/${item.id}`)}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-warning btn-sm me-1"
                                onClick={() => navigate(`/editNews/${item.id}`)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteNews(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <Stack spacing={2} className="mt-3 d-flex align-items-center">
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
  );
};

export default NewsList;
