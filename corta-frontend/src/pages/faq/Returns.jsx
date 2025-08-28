import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Returns = () => {
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
          Returns
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            lineHeight: "1.7",
            marginBottom: "40px",
          }}
        >
          We want you to be fully satisfied with your purchase. Here you can find all the information regarding our return policies and refund process.
        </p>

        <div className="accordion" id="returnsAccordion">
          {[
            {
              title: "Return Period",
              body: "You can return items within 14 days of delivery. Items must be in original condition.",
            },
            {
              title: "Return Process",
              body: "To return a product, submit a return request in your account, print the label, and send the item back.",
            },
            {
              title: "Refund Timing",
              body: "Refunds are processed within 5-7 business days after the returned item is received and inspected.",
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
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
              }}
            >
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  style={{ fontWeight: "600", color: "#333" }}
                >
                  {item.title}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                data-bs-parent="#returnsAccordion"
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

export default Returns;



