import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../../Config";

const FaqList = () => {
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const truncateText = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  };

  const fetchFaqs = async () => {
    try {
      const res = await axiosInstance.get("/faqList");
      if (res.data.success) {
        setFaqs(res.data.body || []);
      }
    } catch (err) {
      console.log("Fetch FAQ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/deleteFaq/${id}`);
        setFaqs(faqs.filter((faq) => faq.id !== id));
        Swal.fire("Deleted!", "FAQ deleted successfully.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete FAQ.", "error");
      }
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              {/* Title + Breadcrumb */}
              <div className="title-box mb-3 pb-1 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 page-title">FAQ List</h4>
                <Link to="/addFaq" className="btn btn-primary btn-sm">
                  <i className="ri-add-line me-1"></i> Add FAQ
                </Link>
              </div>
              <div>
                <nav aria-label="breadcrumb" className="mt-1">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">
                        <i className="ri-home-4-fill me-1" /> Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">FAQ Listings</li>
                  </ol>
                </nav>
              </div>

              <div className="card">
                <div className="card-body">
                  {/* Search Bar */}
                  <div className="mb-3" style={{ maxWidth: "300px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by question..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" />
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-centered ">
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th className="text-end align-top">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                              <tr key={faq.id}>
                                <td>{index + 1}</td>
                                <td>{faq.question}</td>
                                <td style={{ maxWidth: "350px" }}>
                                  {truncateText(faq.answer, 15)}
                                </td>{" "}
                                <td className="text-end">
                                  <button
                                    className="btn btn-soft-primary btn-sm me-1"
                                    onClick={() =>
                                      navigate(`/viewFaq/${faq.id}`)
                                    }
                                  >
                                    <i className="ri-eye-fill"></i>
                                  </button>

                                  <button
                                    className="btn btn-warning btn-sm me-1"
                                    onClick={() =>
                                      navigate(`/editFaq/${faq.id}`)
                                    }
                                  >
                                    <i className="ri-edit-line text-white"></i>
                                  </button>

                                  <button
                                    className="btn btn-soft-danger btn-sm"
                                    onClick={() => deleteFaq(faq.id)}
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center text-muted"
                              >
                                No FAQs found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqList;
