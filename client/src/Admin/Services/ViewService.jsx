import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../../Config";
import { toast } from "react-toastify";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";

const ViewService = () => {
  const { id } = useParams();
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axiosInstance.get(`/viewService/${id}`);
      if (res.data.success) {
        setNews(res.data.body);
      }
    } catch (error) {
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <h4>View Service</h4>

            <div className="card p-4 shadow-sm">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {/* Image */}
                  {news.image ? (
                    <div className="mb-3 text-center">
                      <a
                        href={`${BASE_URL}/${news.image}`}
                        data-fancybox="gallery"
                      >
                        <img
                          src={`${BASE_URL}/${news.image}`}
                          alt="news"
                          style={{
                            maxWidth: "300px",
                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    </div>
                  ) : (
                    <p>No Image Available</p>
                  )}

                  {/* Title */}
                  <h5 className="fw-bold">
                    <strong>Title:</strong>
                    {news.title}
                  </h5>

                  <p className="mt-3">
                    {" "}
                    <strong>Description:</strong>
                    {news.description}
                  </p>

                  {/* Status */}
                  <p>
                    <strong>Status:</strong>
                    {news.status == "1" ? (
                      <span className="text-success">Active</span>
                    ) : (
                      <span className="text-danger">Inactive</span>
                    )}
                  </p>

                  <Link to="/serviceList" className="btn btn-secondary btn-sm">
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

export default ViewService;
