import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosWebsite, URL_BASE } from "../../Config";
import { toast } from "react-toastify";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const fetchListing = async () => {
    try {
      const response = await axiosWebsite.get(`/agricultureImagesView/${id}`);
      console.log(response, ">>>>>>>>>>>>>>>>>>>>");

      const data = response.data.body;
      setListing(data);
      if (data.agri_images?.length > 0) {
        setMainImage(
          `http://localhost:4888/admin/${data.agri_images[0].image_url}`,
        );
      }

      console.log(response.data.body, "<<<<<<<<<<<<<<<<<<<<<<");
    } catch (error) {
      toast.error("Failed to load Listing details");
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (!listing) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row">
        <div className="col-md-6">
          {listing.agri_images?.map((img) => (
            <img
              // key={img.id}
              // src={`http://localhost:4888/admin/${img.image_url}`}
              src={mainImage}
              // alt={listing.title}
              alt="Main"
              className="img-fluid rounded shadow"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          ))}
        </div>
        <div className="d-flex justify-content-center gap-2 flex-wrap">
          {listing.agri_images.map((img) => {
            const imageUrl = `http://localhost:4888/admin${img.image_url}`;
            return (
              <img
                key={img.id}
                src={imageUrl}
                alt="Thumbnail"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                  //   border:
                  //     mainImage === `http://localhost:4888/admin/${img.image_url}`
                  //       ? "2px solid #28a745"
                  //       : "1px solid #ccc",
                  //   borderRadius: "4px",
                  // }}
                  border:
                    mainImage === imageUrl
                      ? "2px solid #28a745"
                      : "1px solid #ccc",
                  borderRadius: "4px",
                }}
                onClick={() =>
                  setMainImage(`http://localhost:4888/admin/${img.image_url}`)
                }
              />
            );
          })}
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">{listing.title}</h2>
        </div>
        <div className="col-md-6">
          <p>{listing.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
