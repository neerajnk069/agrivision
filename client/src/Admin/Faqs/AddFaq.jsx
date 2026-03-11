import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance } from "../../Config";

const AddFaq = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/addFaq", formData);

      if (res.data.success) {
        Swal.fire("Success!", "FAQ added successfully.", "success");
        navigate("/faqlist");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to add FAQ.", "error");
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
              <h4 className="mb-0 page-title">Add FAQ</h4>
              <nav className="breadcrumb mt-1">
                <Link to="/dashboard">Home</Link> / Add FAQ
              </nav>
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
                    Submit
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

export default AddFaq;
