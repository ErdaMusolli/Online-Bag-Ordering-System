import React from "react";

const PaymentMethods = () => {
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
          gap: "25px",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, serif",
            color: "#333",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Payment Methods
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            lineHeight: "1.7",
            marginBottom: "40px",
          }}
        >
          We offer multiple secure payment options for your convenience. Choose
          the method that suits you best at checkout.
        </p>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "25px 30px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "28px" }}>💳</span>
          <div>
            <h2 style={{ margin: 0, color: "#007bff" }}>Credit Cards</h2>
            <p style={{ margin: 0, color: "#555" }}>
              We accept all major credit cards: Visa, MasterCard, American
              Express.
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "25px 30px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "28px" }}>🅿️</span>
          <div>
            <h2 style={{ margin: 0, color: "#28a745" }}>PayPal</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Pay securely using your PayPal account for a faster checkout.
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "25px 30px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "28px" }}>🏦</span>
          <div>
            <h2 style={{ margin: 0, color: "#ffc107" }}>Bank Transfer</h2>
            <p style={{ margin: 0, color: "#555" }}>
              You can pay directly via bank transfer. Orders will be processed
              after payment confirmation.
            </p>
          </div>
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

export default PaymentMethods;

