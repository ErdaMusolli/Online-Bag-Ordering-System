import React, { useState, useEffect } from "react";

const News4 = () => {
  const sliderImages = [
    {
      src: "/Slider1.jpg",
      title: "Elegant Leather Bags",
      description: "Discover timeless leather craftsmanship for every occasion.",
      date: "October 1, 2025",
    },
    {
      src: "/Slider2.jpg",
      title: "Chic Autumn Styles",
      description: "Perfect bags to complement your fall outfits.",
      date: "October 5, 2025",
    },
    {
      src: "/Slider3.jpg",
      title: "Sustainable Materials",
      description: "Eco-friendly bags made with care for the environment.",
      date: "October 10, 2025",
    },
    {
      src: "/Slider4.jpg",
      title: "Versatile Designs",
      description: "Bags designed to match your lifestyle and needs.",
      date: "October 15, 2025",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        backgroundColor: "#333",
        padding: "20px",
        borderRadius: "10px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >

      <div
        style={{
          color: "#f0f0f0",
          marginBottom: "1rem",
          padding: "0 20px",
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          fontStyle: "italic",  
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Discover Our New Fall/Winter Bag Collection!
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Stylish and functional bags designed to elevate your look this season.
        </p>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Crafted from premium materials, perfect for everyday elegance.
        </p>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Shop now and carry your essentials with style and confidence.
        </p>
      </div>

      <div
        style={{
          position: "relative",
          height: "400px",
          maxWidth: "1200px",
          margin: "1rem auto 0 auto",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {sliderImages.map((item, index) => (
          <div
            key={index}
            style={{
              display: index === currentIndex ? "block" : "none",
              position: "absolute",
              width: "100%",
              height: "400px",
            }}
          >
            <img
              src={item.src}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "15px",
                borderRadius: "10px",
                maxWidth: "70%",
              }}
            >
              <h2 style={{ margin: "0 0 5px 0" }}>{item.title}</h2>
              <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{item.date}</p>
              <p style={{ margin: 0 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News4;










