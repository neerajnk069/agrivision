import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#bb2d3b", color: "#fff", marginTop: "50px" }}>
      <div className="container py-5">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h4>Agrivision</h4>
            <p style={{ fontSize: "14px" }}>
              Agrivision is a trusted agriculture platform where farmers and
              buyers can connect, explore listings, and grow together.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link to="/" style={linkStyle}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" style={linkStyle}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/listings" style={linkStyle}>
                  Listings
                </Link>
              </li>
              <li>
                <Link to="/contact" style={linkStyle}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/register" style={linkStyle}>
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5>Contact Info</h5>
            <p style={{ fontSize: "14px" }}>📍 Meerut, Uttar Pradesh, India</p>
            <p style={{ fontSize: "14px" }}>📞 +91 9876543210</p>
            <p style={{ fontSize: "14px" }}>✉ info@agrivision.com</p>

            {/* Social Icons */}
            <div className="mt-3">
              <a href="#" style={iconStyle}>
                🌐
              </a>
              <a href="#" style={iconStyle}>
                📘
              </a>
              <a href="#" style={iconStyle}>
                📸
              </a>
              <a href="#" style={iconStyle}>
                🐦
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          background: "#bb2d3b",
          textAlign: "center",
          padding: "10px 0",
        }}
      >
        <small>
          © {new Date().getFullYear()} Agrivision. All Rights Reserved.
        </small>
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  display: "block",
  marginBottom: "8px",
};

const iconStyle = {
  color: "#fff",
  fontSize: "20px",
  marginRight: "10px",
  textDecoration: "none",
};

export default Footer;
