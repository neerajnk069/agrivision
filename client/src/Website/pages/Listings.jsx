import { useEffect, useState } from "react";
import { axiosWebsite, URL_BASE } from "../../Config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      const response = await axiosWebsite.get("/agricultureImagesList");
      if (Array.isArray(response.data.body.data)) {
        setListings(response.data.body.data);
      } else {
        console.log("Data is not array:", response.data.body);
        setListings([]);
      }
    } catch (error) {
      toast.error("Failed to fetch listings");
    }
  };

  useEffect(() => {}, [listings]);

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Agriculture Listings</h2>

      <div className="row">
        {Array.isArray(listings) &&
          listings.map((item) => (
            <div className="col-lg-4 col-md-6 mb-4" key={item.id || item._id}>
              <div className="card shadow-sm h-100">
                {item.agri_images?.length > 0 && (
                  <img
                    src={`http://localhost:4888/admin/${item.agri_images[0].image_url}`}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    // alt={item.title}
                  />
                )}
                <div className="card-body">
                  {/* Title */}
                  <h5 className="card-title">{item.title}</h5>

                  {/* Description */}
                  <p className="card-text">
                    {item.description.substring(0, 100)}...
                  </p>

                  <Link
                    to={`/listingDetails/${item.id}`}
                    className="btn btn-success btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Listings;
