import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ShippingInfo = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px",
        backgroundColor: "#f4f6f8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Georgia, serif",
            color: "#333",
          }}
        >
          Shipping Information
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            lineHeight: "1.7",
            marginBottom: "40px",
          }}
        >
          At CORTA, we strive to deliver your orders quickly and safely. 
          Below you can find detailed information about our shipping policies, 
          costs, and tracking procedures to ensure a smooth delivery experience.
        </p>

        <div className="accordion" id="shippingAccordion">
          {[
            {
              title: "Delivery Times",
              body: "Orders are processed within 1-2 business days. Standard shipping usually takes 3-5 business days. Expedited shipping options are available at checkout.",
            },
            {
              title: "Shipping Costs",
              body: "Shipping fees depend on your location and the total weight of your order. Free shipping is available for orders over $50.",
            },
            {
              title: "Tracking Your Order",
              body: "Once your order is shipped, you will receive a tracking number by email. Use it to track the delivery status on our courier's website.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="accordion-item"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "15px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
                const button = e.currentTarget.querySelector("button");
                if (button) button.style.backgroundColor = "#e8f0fe"; 
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
                const button = e.currentTarget.querySelector("button");
                if (button) button.style.backgroundColor = ""; 
              }}
            >
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    transition: "background-color 0.2s",
                  }}
                >
                  {item.title}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                data-bs-parent="#shippingAccordion"
              >
                <div className="accordion-body" style={{ color: "#555" }}>
                  {item.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer
          style={{
            textAlign: "center",
            color: "#888",
            marginTop: "40px",
            fontSize: "14px",
          }}
        >
        </footer>
      </div>
    </div>
  );
};

export default ShippingInfo;

