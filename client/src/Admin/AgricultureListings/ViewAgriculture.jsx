import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../../Config";
import { toast } from "react-toastify";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const ViewAgriculture = () => {
  const { id } = useParams();
  const [agricultures, setAgricultures] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgricultures();
  }, []);

  const fetchAgricultures = async () => {
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
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <h4>View Agriculture</h4>
            <div className="card p-4 shadow-sm">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>
                    <strong>Agent Name:</strong>{" "}
                    {agricultures.agent?.name || "N/A"}
                  </p>

                  <p>
                    <strong>Title:</strong> {agricultures.title}
                  </p>

                  <p>
                    <strong>Description:</strong> {agricultures.description}
                  </p>

                  <p>
                    <strong>Approved By:</strong>{" "}
                    {agricultures.approved_by || "Admin"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {agricultures.status === "approved" ? (
                      <span className="badge bg-success">Approved</span>
                    ) : agricultures.status === "rejected" ? (
                      <span className="badge bg-danger">Rejected</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    )}
                  </p>

                  <Link
                    to="/agricultureList"
                    className="btn btn-secondary btn-sm mt-3"
                  >
                    Back
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgriculture;
