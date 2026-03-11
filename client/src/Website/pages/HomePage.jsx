import { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import About from "../pages/About";
import Listings from "../pages/Listings";
// import Footer from "../layout/Footer";
import { axiosWebsite, URL_BASE } from "../../Config";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const res = await axiosWebsite.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Navbar />
      {/* <!-- Header Start --> */}
      <div className="container-fluid bg-dark p-0 mb-5">
        <div className="row g-0 flex-column-reverse flex-lg-row">
          <div className="col-lg-6 p-0 wow fadeIn" data-wow-delay="0.1s">
            <div
              className="header-bg h-100 d-flex flex-column justify-content-center p-5"
              style={{
                backgroundImage: "url('/images/homepage.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h1 className="display-4 text-light mb-5">
                Agriculture Listings and Information, All in one place
              </h1>
              <div className="d-flex align-items-center pt-4 animated slideInDown">
                <a
                  href=""
                  className="btn btn-primary py-sm-3 px-3 px-sm-5 me-5"
                >
                  Browser Listings
                </a>
                <button
                  type="button"
                  className="btn-play"
                  data-bs-toggle="modal"
                  data-src="https://www.youtube.com/embed/DWRcNpR6Kdc"
                  data-bs-target="#videoModal"
                ></button>
              </div>
            </div>
          </div>
          <div
            className="col-lg-6 wow fadeIn"
            data-wow-delay="0.5s"
            style={{
              backgroundImage: "url('/images/homepage3.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className=" header-carousel">
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/pic1.jpg"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/men6.avif"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/pic5.jpg"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/men7.avif"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/pic7.jpg"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/men8.avif"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/pic13.jpg"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/men9.avif"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/pic13.jpg"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              <div className="owl-carousel-item">
                <img
                  className="img-fluid"
                  src="img/men10.avif"
                  style={{ height: 400 }}
                  alt=""
                />
              </div>
              {/* </OwlCarousel> */}
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Header End -->

    <!-- Video Modal Start --> */}
      <div
        className="modal modal-video fade"
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content rounded-0">
            <div className="modal-header">
              <h3 className="modal-title" id="exampleModalLabel">
                Youtube Video
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* <!-- 16:9 aspect ratio --> */}
              <div className="ratio ratio-16x9">
                <iframe
                  className="embed-responsive-item"
                  src=""
                  id="video"
                  allowFullScreen
                  allowscriptaccess="always"
                  allow="autoplay"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Video Modal End --> */}
      <About />
      <Listings />
      {/* <Footer /> */}
    </>
  );
};

export default Home;
