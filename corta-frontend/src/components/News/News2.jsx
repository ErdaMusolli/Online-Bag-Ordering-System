import React from "react";

const News2 = () => {
  const content = (
    <>
      <h3
        style={{
          fontSize: "25px",
          fontWeight: "bold",
          color: "#b3b3b3",
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          marginBottom: "1rem",
          fontStyle: "italic",
        }}
      >
        Special offer for new customers!
      </h3>
      <h5
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "#b3b3b3",
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          marginBottom: "0.8rem",
          fontStyle: "italic",
        }}
      >
        Get an exclusive 15% discount on your first order! This is our way of
        welcoming you warmly to the CORTA family. Whether you’re looking to
        upgrade your wardrobe or simply want to treat yourself to some elegant
        accessories, this special offer is the perfect chance to do so.
      </h5>
      <h5
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "#b3b3b3",
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          marginBottom: "0.8rem",
          fontStyle: "italic",
        }}
      >
        Our collections feature timeless leather bags crafted with the finest
        materials, chic seasonal styles designed to complement any outfit, and
        sustainable options made with care for the environment. By choosing
        CORTA, you’re not just investing in fashion, but also in quality,
        sustainability, and style.
      </h5>
      <h5
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "#b3b3b3",
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          marginBottom: "0.8rem",
          fontStyle: "italic",
        }}
      >
        Don’t miss this chance to enjoy a 15% saving on your first purchase.
        Register now to get started, and we’ll keep you updated with the latest
        arrivals, exclusive offers, and insider tips to make your shopping
        experience effortless and enjoyable.
      </h5>
      <h5
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "#b3b3b3",
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          marginBottom: "0.8rem",
          fontStyle: "italic",
        }}
      >
        Whether it’s a gift for yourself or a loved one, our collection has
        something special for everyone. Embrace style, elegance, and comfort
        with CORTA today and step into the new season with confidence and
        flair.
      </h5>
      <h5
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "#b3b3b3",
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontStyle: "italic",
        }}
      >
        Start your journey with us — because your style deserves the very best,
        every day.
      </h5>
    </>
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/News2.1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#b3b3b3",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        className="form-container p-4 rounded"
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default News2;







