import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5197/api/purchase/my", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Error fetching orders.");
        }

        const data = await response.json();

        setOrders(data.$values || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);


  const ordersWithImages = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      firstImage: order.purchaseItems?.$values?.[0]?.productImageUrl || "/default-product.jpg",
      displayStatus: order.status === "Completed" ? "Delivered" : order.status,
    }));
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
                src={
                  order.firstImage.startsWith("http") 
                    ? order.firstImage 
                    : `http://localhost:5197${order.firstImage}`
                }
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





