import React from "react";

const News1 = () => (
  <div
    style={{
      minHeight: "100vh",
      width: "100vw",
      backgroundImage: "url('/News1.1.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      color: "rgb(104, 85, 61)",
      fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
      textAlign: "center",
    }}
  >
    <h2 style={{ marginBottom: "1rem", fontSize: "32px", fontWeight: "bold" }}>
      Introducing the Bamboo Temple bag
    </h2>
    <p style={{ maxWidth: "800px", fontSize: "18px", marginBottom: "2rem", fontStyle: "italic" }}>
      Experience the fusion of nature and style with our newest release: the  Bamboo Temple bag.
      Crafted from sustainable materials and inspired by minimalist aesthetics, this bag offers a lightweight
      yet durable solution for your daily essentials. The breathable bamboo fibers ensure comfort,
      while the clean lines and modern design reflect eco-conscious elegance.
      Perfect for work, travel, or everyday outings – Bamboo Temple bag is your new must-have companion.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        width: "100%",
        maxWidth: "1000px",
        padding: "1rem",
      }}
    >
      <img src="/News1.2.jpg" alt="Organic Bamboo Bag View 1" style={{ width: "100%", borderRadius: "8px" }} />
      <img src="/News1.3.jpg" alt="Organic Bamboo Bag View 2" style={{ width: "100%", borderRadius: "8px" }} />
      <img src="/News1.4.jpg" alt="Organic Bamboo Bag View 3" style={{ width: "100%", borderRadius: "8px" }} />
      <img src="/News1.5.jpg" alt="Organic Bamboo Bag View 4" style={{ width: "100%", borderRadius: "8px" }} />
    </div>
  </div>
);

export default News1;






