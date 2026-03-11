import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../../Config";
import { toast } from "react-toastify";
// import "@fancyapps/fancybox/dist/jquery.fancybox.css";
// import "@fancyapps/fancybox";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const ViewAgricultureImages = () => {
  const { id } = useParams();
  const [agricultures, setAgricultures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgricultures();
  }, []);

  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {});
    return () => {
      Fancybox.destroy();
    };
  }, [agricultures]);

  const fetchAgricultures = async () => {
    try {
      const res = await axiosInstance.get(`/agricultureImagesView/${id}`);
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
            <h4>View Agriculture Images </h4>
            <div className="card p-4 shadow-sm">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>
                    <strong>Agent Name:</strong>{" "}
                    {agricultures.agent?.name || "N/A"}
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <p>
                      <strong>Image:</strong>
                    </p>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
                    >
                      {agricultures.agri_images?.length > 0 ? (
                        agricultures.agri_images.map((img) => (
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
                                width: "150px",
                                marginRight: "10px",
                                marginBottom: "10px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                        ))
                      ) : (
                        <p>No Images Found</p>
                      )}
                    </div>
                  </div>
                  <p>
                    <strong>Title:</strong> {agricultures.title}
                  </p>

                  <Link
                    to="/agricultureImagesList"
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

export default ViewAgricultureImages;
