import React from "react";

const NoInternet = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #8ec8f8ff, #79bbf1ff)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          fontSize: "80px",
          animation: "pulse 1.5s infinite",
        }}
      >
        🔌
      </div>
      <h1 style={{ fontSize: "2.5rem", margin: "20px 0 10px" }}>
        No Internet Connection
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "400px" }}>
        Oops! It looks like you're offline. Please check your internet
        connection and try again.
      </p>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default NoInternet;
