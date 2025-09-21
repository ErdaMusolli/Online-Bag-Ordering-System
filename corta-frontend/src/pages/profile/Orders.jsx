import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/apiClient";

const getImageUrl = (url) => {
  if (!url) return "/default-product.jpg";
  if (url.startsWith("http")) return url;
  return `https://localhost:7254${url.startsWith("/images/") ? url : `/images/${url}`}`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const { data } = await api.get("/purchase/my"); 
        const list = Array.isArray(data) ? data : data?.$values ?? [];
        if (!canceled) setOrders(list);
      } catch (err) {
        if (!canceled) {
          if (err?.response?.status === 401) {
            navigate("/login", { replace: true });
          } else {
            setError(err?.response?.data || err.message || "Error fetching orders.");
          }
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, [navigate]);

  const ordersWithImages = useMemo(() => {
    return (orders || []).map((order) => {
      const firstItem =
        order?.purchaseItems?.$values?.[0] ??
        (Array.isArray(order?.purchaseItems) ? order.purchaseItems[0] : undefined);
      return {
        ...order,
        firstImage: getImageUrl(firstItem?.productImageUrl),
        displayStatus: order?.status === "Completed" ? "Delivered" : order?.status,
      };
    });
  }, [orders]);

  if (loading) {
    return (
      <div className="text-center" style={{ fontSize: "1.5rem", marginTop: "50px" }}>
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" style={{ fontSize: "1.5rem" }}>
        {error}
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="alert alert-info text-center" style={{ fontSize: "1.5rem" }}>
        You haven't placed any orders yet.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "78vw",
        minHeight: "100vh",
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h2
        className="mb-5 text-center fw-bold"
        style={{
          fontFamily: "Georgia, serif",
          color: "#6a1b9a",
          fontSize: "3rem",
        }}
      >
        ORDERS
      </h2>

      {ordersWithImages.map((order) => {
        const purchaseId = order.id;
        const items = order.purchaseItems?.$values || [];
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
          <div
            key={purchaseId}
            className="row border rounded p-3 mb-3 align-items-center"
            style={{ borderColor: "#ddd", backgroundColor: "#fafafa" }}
          >
            <div className="col-md-8 col-sm-12" style={{ fontSize: "1.1rem", lineHeight: 1.3 }}>
              <div>
                <strong>Order Number:</strong> {purchaseId}
              </div>
              <div>
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString("en-US")}
              </div>
              <div>
                <strong>Order Status:</strong>{" "}
                <span className="text-primary">{order.displayStatus}</span>
              </div>
              <div>
                <strong>Order Total:</strong> {total.toFixed(2)}€
              </div>
            </div>

            <div className="col-md-4 col-sm-12 d-flex flex-column align-items-center mt-3 mt-md-0">
              <Link
                to={`/profile/order-details/${purchaseId}`}
                state={{ order }}
                className="text-decoration-none fw-semibold text-primary mb-3"
                style={{ fontSize: "1.2rem" }}
              >
                View Order Details →
              </Link>

              <img
                src={order.firstImage}
                alt="Product"
                style={{
                  width: "140px",
                  height: "180px",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-product.jpg";
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;






