import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
          padding: "20px",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        Nuk u gjet informacioni i porosisë. Ju lutem kthehuni tek lista e porosive.
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "40px",
            padding: "10px 18px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ← Back
        </button>
      </div>
    );
  }

  const items = order.purchaseItems?.$values
    ? order.purchaseItems.$values
    : order.purchaseItems || [];

  const purchaseId = order.id;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "200%",
        paddingTop: "80px",
        paddingBottom: "40px",
        backgroundColor: "#f8f9fa",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "25px",
            padding: "10px 18px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "30px",
            fontStyle: "italic",
            color: "#6a1b9a",
            fontFamily: "'Georgia', serif",
            letterSpacing: "1.5px",
          }}
        >
          <strong>Numri i porosisë:</strong> {purchaseId}
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            backgroundColor: "#f1f3f5",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "30px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Data e porosisë:</div>
            <div style={{ fontWeight: "400", marginTop: "4px" }}>
              {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Statusi:</div>
            <div
              style={{
                marginTop: "4px",
                color: order.status?.toLowerCase() === "konfirmuar" ? "green" : "#007bff",
                fontWeight: "700",
              }}
            >
              {order.status}
            </div>
          </div>

          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Totali:</div>
            <div style={{ marginTop: "4px", fontWeight: "700" }}>{total.toFixed(2)}€</div>
          </div>
        </div>

        <h2 style={{ fontWeight: "600", fontSize: "20px", marginBottom: "15px" }}>
          Artikujt në porosi
        </h2>

        <div>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                alignItems: "center",
                padding: "15px 10px",
                borderBottom: "1px solid #eee",
              }}
            >
              <img
                src={`/${item.productImageUrl?.replace("public/", "")}` || "/default-product.jpg"}
                alt={item.productName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-product.jpg";
                }}
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <div
                style={{
                  flex: "1 1 200px",
                  minWidth: "200px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#222",
                  }}
                >
                  {item.productName}
                </p>
                <p style={{ margin: "6px 0 0", color: "#555", fontSize: "14px" }}>
                  Sasia: {item.quantity}
                </p>
                <p style={{ margin: "4px 0 0", color: "#555", fontSize: "14px" }}>
                  Çmimi njësi: {item.price.toFixed(2)}€
                </p>
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  minWidth: "80px",
                  textAlign: "right",
                  color: "#333",
                }}
              >
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "35px",
            paddingTop: "15px",
            borderTop: "2px solid #007bff",
            fontWeight: "700",
            fontSize: "18px",
            textAlign: "right",
            color: "#007bff",
          }}
        >
          Totali i porosisë: {total.toFixed(2)}€
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;






