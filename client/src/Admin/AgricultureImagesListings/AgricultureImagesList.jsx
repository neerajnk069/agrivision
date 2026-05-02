import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { BASE_URL, axiosInstance } from "../../Config";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const AgricultureImagesList = () => {
  const navigate = useNavigate();
  const [agricultures, setAgricultures] = useState([]);
  const [selectedAgricultures, setSelectedAgricultures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        `/agricultureImagesList?page=${page}&limit=${limit}&search=${encodeURIComponent(
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
        await axiosInstance.delete(`/agricultureImagesDelete/${id}`);
        toast.success("agriculture deleted successfully");
        fetchagricultures(currentPage, searchTerm, dateFilter);
      } catch (error) {
        toast.error("Failed to delete agricultures");
      }
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
                <h4>Agricultures Images List</h4>
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
                          <th>Images</th>
                          <th>Title</th>
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
                              No agricultures images list Found
                            </td>
                          </tr>
                        ) : (
                          agricultures.map((item, index) => (
                            <tr key={item.id}>
                              <td>{(currentPage - 1) * limit + index + 1}</td>
                              <td>{item.agent?.name}</td>
                              <td>
                                {item.agri_images &&
                                item.agri_images.length > 0 ? (
                                  <img
                                    src={`${BASE_URL}/${item.agri_images[0].image_url}`}
                                    alt="agriculture"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "5px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  "No Image"
                                )}
                              </td>
                              <td>{item.title}</td>
                              <td className="text-end">
                                <button
                                  className="btn btn-soft-primary btn-sm me-1"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#view-details"
                                  onClick={() => setSelectedAgricultures(item)}
                                >
                                  <i className="ri-eye-fill font-size-16"></i>{" "}
                                </button>
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
              Agiculture Images Details
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
          {selectedAgricultures ? (
            <>
              <div className="scroll-room mb-3" id="scrollRoom">
                <label className="text-muted small">Images</label>

                {selectedAgricultures?.agri_images?.length > 0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {selectedAgricultures.agri_images.map((img) => (
                      <a
                        key={img.id}
                        href={`${BASE_URL}${img.image_url}`}
                        data-fancybox="gallery"
                        data-caption="Agriculture Image"
                      >
                        <img
                          src={`${BASE_URL}${img.image_url}`}
                          alt="agriculture"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <p>No Images Found</p>
                  </div>
                )}
              </div>

              <div className="border-bottom mb-3 pb-3">
                <label className="text-muted small">Agent Name</label>
                <h5 className="fw-semibold mb-2">
                  {selectedAgricultures.agent?.name || "No Name"}
                </h5>
              </div>

              <div className="mb-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="text-muted small">Title</label>
                    <p className="fw-medium">
                      {selectedAgricultures.title || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No agriculture images selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgricultureImagesList;
