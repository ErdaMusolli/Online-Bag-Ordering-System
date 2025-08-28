import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [error, setError] = useState(null);

  const order = location.state?.order;

  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          textAlign: "center",
          color: "red",
        }}
      >
        Order information not found. Please return to the orders list.
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
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

  const displayStatus = useMemo(() => {
    if (order.status === "Completed") return "Delivered";
    return order.status;
  }, [order.status]);

  const items = order.purchaseItems?.$values || order.purchaseItems || [];

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = itemsTotal * 0.18;
  const total = itemsTotal + tax;

  const purchaseId = order?.id;

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setLoadingCancel(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`http://localhost:5197/api/purchase/${purchaseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete order");
      }

      alert("Order cancelled and removed successfully");
      navigate(-1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <div style={{ width: "78vw", height: "100vh", padding: "20px", boxSizing: "border-box", overflowY: "auto", backgroundColor: '#f8f9fa' }}>
      <div style={{ flex: 1, width: "90%", maxWidth: "1000px", margin: "0 auto", paddingTop: "80px", paddingBottom: "40px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ marginBottom: "25px", padding: "10px 18px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", fontStyle: "italic", color: "#6a1b9a", fontFamily: "'Georgia', serif", letterSpacing: "1.5px" }}>
          <strong>Order Number:</strong> {purchaseId}
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", backgroundColor: "#f1f3f5", padding: "20px", borderRadius: "6px", marginBottom: "30px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Order Date:</div>
            <div style={{ fontWeight: "400", marginTop: "4px" }}>
              {new Date(order.createdAt).toLocaleDateString("en-Us", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Status:</div>
            <div style={{ marginTop: "4px", color: displayStatus === "Delivered" ? "green" : displayStatus === "Cancelled" ? "red" : "#007bff", fontWeight: "700" }}>
              {displayStatus}
            </div>
          </div>

          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Tax (18%):</div>
            <div style={{ marginTop: "4px", fontWeight: "700" }}>{tax.toFixed(2)}€</div>
          </div>

          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <div>Total:</div>
            <div style={{ marginTop: "4px", fontWeight: "700" }}>{total.toFixed(2)}€</div>
          </div>
        </div>

        <h2 style={{ fontWeight: "600", fontSize: "20px", marginBottom: "15px" }}>Items in Order</h2>

        <div>
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", padding: "15px 10px", borderBottom: "1px solid #eee" }}>
              <img
                src={
                  item.productImageUrl?.startsWith("http") 
                    ? item.productImageUrl 
                    : `http://localhost:5197${item.productImageUrl}`
                }
                alt={item.productName}
                onError={(e) => { e.target.onerror = null; e.target.src = "/default-product.jpg"; }}
                style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "16px", color: "#222" }}>{item.productName}</p>
                <p style={{ margin: "6px 0 0", color: "#555", fontSize: "14px" }}>Quantity: {item.quantity}</p>
                <p style={{ margin: "4px 0 0", color: "#555", fontSize: "14px" }}>Unit Price: {item.price.toFixed(2)}€</p>
              </div>
              <div style={{ fontWeight: "700", fontSize: "16px", minWidth: "80px", textAlign: "right", color: "#333" }}>
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </div>
          ))}
        </div>

        {displayStatus !== "Delivered" && displayStatus !== "Cancelled" && (
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button
              onClick={handleCancelOrder}
              disabled={loadingCancel}
              style={{ padding: "10px 18px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }}
            >
              {loadingCancel ? "Cancelling..." : "Cancel Order"}
            </button>
            {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;








