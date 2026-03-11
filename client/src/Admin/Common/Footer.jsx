import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#f5f5f5",
        color: "#666",
        textAlign: "center",
        fontSize: "14px",
      }}
    >
      <span>
        Copyright © 2026 Designed by{" "}
        <Link
          to="/dashboard"
          rel="nofollow noopener noreferrer"
          title="Agrivision"
          style={{ textDecoration: "none", color: "#bb2d3b" }}
        >
          Agrivision
        </Link>
        . All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
