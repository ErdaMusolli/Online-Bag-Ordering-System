import React from "react";

const News5 = () => {
  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "1600px",
        height: "750px",
        backgroundImage: `url('/News5.1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "15px",
        margin: "50px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textShadow: "4px 4px 10px rgba(0,0,0,0.9)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "60px", fontWeight: "900", marginBottom: "1rem" }}>
        Summer Collection Coming Soon!
      </h2>
      <p style={{ fontSize: "24px", fontWeight: "500", maxWidth: "900px", marginBottom: "2rem" }}>
        Get ready for fresh colors, light styles, and designs that will fill your
        days with positive energy. Our summer collection will be launched soon – stay
        tuned to see the latest products!
      </p>
      <p style={{ fontSize: "36px", fontWeight: "700" }}>Stay Tuned</p>
    </div>
  );
};

export default News5;






