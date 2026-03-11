import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../../Config";

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const res = await axiosInstance.get(`/viewFaq/${id}`);
      if (res.data.success) {
        setFormData(res.data.body);
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch FAQ.", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.put(`/updateFaq/${id}`, formData);
      if (res.data.success) {
        Swal.fire("Updated!", "FAQ updated successfully.", "success");
        navigate("/faqlist");
      }
    } catch (error) {
      Swal.fire("Error!", "Update failed.", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      const value = e.target.value;
      if (value.endsWith("  ")) {
        e.preventDefault();
      }
    }
  };

  return (
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="title-box mb-3 pb-1">
              <h4 className="mb-0 page-title">Edit FAQ</h4>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Question</label>
                    <input
                      type="text"
                      className="form-control"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Answer</label>
                    <textarea
                      className="form-control"
                      name="answer"
                      rows="4"
                      value={formData.answer}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                  <Link to="/faqlist" className="btn btn-secondary ms-2">
                    Cancel
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFaq;
