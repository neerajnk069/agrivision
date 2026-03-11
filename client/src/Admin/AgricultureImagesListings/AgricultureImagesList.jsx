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
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Agricultures Images List</h4>
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
                              {item.agri_images && item.agri_images.length > 0
                                ? item.agri_images.map((img) => (
                                    // <a
                                    //   href={`${BASE_URL}/${item.agri_images[0].image_url}`}
                                    //   data-fancybox={`gallery-${item.id}`}
                                    // >
                                    <img
                                      key={img.id}
                                      src={`${BASE_URL}/${img.image_url}`}
                                      alt="agricultures"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        marginRight: "5px",
                                        borderRadius: "5px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                      }}
                                    />
                                  ))
                                : // </a>
                                  "No Image"}
                            </td>
                            <td>{item.title}</td>
                            <td className="text-end">
                              <button
                                className="btn btn-soft-primary btn-sm me-1"
                                onClick={() =>
                                  navigate(`/viewAgricultureImages/${item.id}`)
                                }
                              >
                                View
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteAgriculture(item.id)}
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

export default AgricultureImagesList;
