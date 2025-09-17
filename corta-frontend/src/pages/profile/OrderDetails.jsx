import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/apiClient";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [error, setError] = useState(null);

   useEffect(() => {
    let canceled = false;
    (async () => {
      try {
       const res = await api.get(`/purchase/${id}`); 
        if (!canceled) setOrder(res.data);
      } catch (err) {
        if (!canceled) {
          if (err?.response?.status === 401) {
            setError("Session expired. Please login again.");
            navigate("/login", { replace: true });
          } else {
            setError(err?.response?.data || err.message || "Failed to fetch order");
          }
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [id, navigate]);


  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setLoadingCancel(true);
    setError(null);

     try {
      await api.delete(`/purchase/${id}`);
      alert("Order cancelled successfully");
      navigate(-1);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data || err.message || "Failed to cancel order";
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/login", { replace: true });
      } else {
        setError(msg);
      }
    } finally {
      setLoadingCancel(false);
    }
  };

  const items = order?.purchaseItems?.$values || order?.purchaseItems || [];
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shipping = itemsTotal < 50 ? 2 : 0;
  const total = itemsTotal + shipping;

  const address = items.length > 0 ? {
    city: items[0].city,
    neighborhood: items[0].neighborhood,
    street: items[0].street,
    phone: items[0].phoneNumber,
  } : {};

  const displayStatus = order?.status === "Completed" ? "Delivered" : order?.status || "";

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div style={{ width: "78vw", minHeight: "100vh", padding: "20px", backgroundColor: "#f8f9fa" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", paddingTop: "80px", paddingBottom: "40px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ marginBottom: "25px", padding: "10px 18px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", fontStyle: "italic", color: "#6a1b9a", fontFamily: "'Georgia', serif", letterSpacing: "1.5px" }}>
          <strong>Order Number:</strong> {order.id}
        </h2>

 
        <h3 style={{ fontWeight: "600", fontSize: "20px", marginBottom: "15px" }}>User Information</h3>
        {order.user ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", backgroundColor: "#f1f3f5", padding: "20px", borderRadius: "6px", fontSize: "16px" }}>
            <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
              <strong>Username:</strong>
              <div style={{ marginTop: "4px", fontWeight: "400" }}>{order.user.username}</div>
            </div>
            <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
              <strong>Email:</strong>
              <div style={{ marginTop: "4px", fontWeight: "400" }}>{order.user.email}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: "red", marginBottom: "20px" }}>User information not available</div>
        )}


        <h3 style={{ fontWeight: "600", fontSize: "20px", marginBottom: "15px", marginTop: "25px" }}>Shipping Address</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", backgroundColor: "#f1f3f5", padding: "20px", borderRadius: "6px", fontSize: "16px" }}>
          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <strong>City:</strong>
            <div style={{ marginTop: "4px", fontWeight: "400" }}>{address.city || "-"}</div>
          </div>
          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <strong>Neighborhood:</strong>
            <div style={{ marginTop: "4px", fontWeight: "400" }}>{address.neighborhood || "-"}</div>
          </div>
          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <strong>Street:</strong>
            <div style={{ marginTop: "4px", fontWeight: "400" }}>{address.street || "-"}</div>
          </div>
          <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <strong>Phone:</strong>
            <div style={{ marginTop: "4px", fontWeight: "400" }}>{address.phone || "-"}</div>
          </div>
        </div>

        <h3 style={{ fontWeight: "600", fontSize: "20px", margin: "30px 0 15px" }}>Items in Order</h3>
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", padding: "15px 10px", borderBottom: "1px solid #eee" }}>
              <img
                src={item.productImageUrl?.startsWith("http") ? item.productImageUrl : `http://localhost:5197${item.productImageUrl}`}
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

        <div style={{ display: "flex", justifyContent: "flex-end", fontWeight: "400", fontSize: "16px", marginTop: "20px" }}>
          <span>Shipping: {shipping.toFixed(2)}€</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", fontWeight: "700", fontSize: "18px", marginTop: "4px" }}>
          <span>Total: {total.toFixed(2)}€</span>
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

