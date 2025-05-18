import React from "react";

const News2 = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/News3.1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "rgb(3, 0, 0)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        className="text p-4 rounded"
        style={{
          maxWidth: "700px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <h3
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            marginTop: "5%",
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            color: "rgb(112, 95, 73)",
          }}
        >
          Our Story
        </h3>
        <br />
        <h5
          style={{
            fontSize: "15px",
            lineHeight: 1.5,
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            color: "rgb(104, 85, 61)",
          }}
        >
          Founded by four young girls with backgrounds in product design
          engineering and fashion design, our brand is rooted in a shared passion
          for sustainability and style. Our journey began with a deep-seated
          desire to create something meaningful. This shared experience fueled our
          determination to offer garments that reflect our values of simplicity,
          comfort, and authenticity.
        </h5>
        <br />
        <h5
          style={{
            fontSize: "15px",
            lineHeight: 1.5,
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            color: "rgb(104, 85, 61)",
          }}
        >
          Finding the right fabrics proved to be a daunting task. We searched
          tirelessly for organic materials that met our standards, sourced from
          distant corners of the world. Overcoming logistical challenges like
          transportation costs reinforced our commitment to quality and
          sustainability.
        </h5>
        <br />
        <h5
          style={{
            fontSize: "15px",
            lineHeight: 1.5,
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            color: "rgb(104, 85, 61)",
          }}
        >
          Craftsmanship has always been at the heart of what we do. Each product
          is a testament to months of dedication and attention to detail,
          ensuring that every piece not only meets but exceeds our high standards.
        </h5>
        <br />
        <h5
          style={{
            fontSize: "15px",
            lineHeight: 1.5,
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            color: "rgb(104, 85, 61)",
          }}
        >
          Looking ahead, we are excited to share our journey and values with our
          community. Through genuine storytelling and engaging content, we aim to
          inspire a deeper appreciation for natural beauty and sustainable living.
        </h5>
      </div>
    </div>
  );
};

export default News2;


