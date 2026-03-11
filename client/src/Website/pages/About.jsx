import React from "react";
import { axiosWebsite, URL_BASE } from "../../Config";

const About = () => {
  return (
    <>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold">About Us</h1>
          <p className="text-muted mt-3">
            We help people find their dream property with trust and
            transparency.
          </p>
        </div>

        {/* Company Info */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              alt="About"
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6">
            <h3 className="fw-semibold mb-3">Who We Are</h3>
            <p>
              We are a professional real estate platform dedicated to helping
              buyers, sellers, and renters connect easily. Our mission is to
              make property search simple, fast, and transparent.
            </p>
            <p>
              With verified listings, trusted agents, and detailed property
              information, we ensure that every customer finds the perfect
              match.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="row text-center mb-5">
          <div className="col-md-6">
            <div className="p-4 shadow rounded">
              <h4 className="fw-bold">Our Mission</h4>
              <p className="mt-3">
                To simplify property buying and renting through technology and
                trusted services.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 shadow rounded">
              <h4 className="fw-bold">Our Vision</h4>
              <p className="mt-3">
                To become the most trusted and user-friendly real estate
                platform.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-5">
          <h3 className="text-center fw-bold mb-4">Why Choose Us?</h3>

          <div className="row text-center">
            <div className="col-md-4">
              <div className="p-4 border rounded">
                <h5>Verified Listings</h5>
                <p className="text-muted mt-2">
                  All properties are verified to ensure authenticity.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded">
                <h5>Trusted Agents</h5>
                <p className="text-muted mt-2">
                  Work with experienced and professional agents.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded">
                <h5>Easy Process</h5>
                <p className="text-muted mt-2">
                  Simple search, compare, and contact process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call To Action */}
        <div className="text-center bg-light p-5 rounded">
          <h3 className="fw-bold">Ready to Find Your Dream Property?</h3>
          <p className="mt-3">
            Browse our listings and connect with trusted property owners today.
          </p>
          <a href="/listings" className="btn btn-danger mt-3">
            View Listings
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
