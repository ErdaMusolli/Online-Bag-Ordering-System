import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiClient";

const ASSET_HOST = "https://localhost:7254";
const getImageUrl = (url) =>
  url ? (url.startsWith("http") ? url : `${ASSET_HOST}${url}`) : "/placeholder.jpg";

const ViewReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reviews");
      const data = res.data;
      const raw = Array.isArray(data?.$values)
        ? data.$values
        : Array.isArray(data)
        ? data
        : [];

      const rows = raw.map((r) => {
        let img = r.productImageUrl ?? r.ProductImageUrl ?? null;
        if (img) {
          img = img.startsWith("/") ? img : `/${img}`;
        }
        return {
          id: r.id ?? r.Id,
          productId: r.productId ?? r.ProductId,
          rating: r.rating ?? r.Rating,
          comment: r.comment ?? r.Comment,
          userEmail: r.userEmail ?? r.UserEmail,
          createdAt: r.createdAt ?? r.CreatedAt,
          productImageUrl: img,
        };
      });

      setReviews(rows);
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login", { replace: true });
      console.error("Error fetching reviews:", err?.response?.status || err?.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete error:", err?.response?.status || err?.message);
      alert("Delete failed");
    }
  };

  const filteredReviews = reviews.filter((r) =>
    (r.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        paddingTop: "80px",
        boxSizing: "border-box",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <button
        className="btn btn-outline-secondary mb-3 align-self-start"
        onClick={() => navigate("/admin")}
      >
        ← Back
      </button>

      <h2 className="text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>
        ⭐ View Reviews
      </h2>

      <div className="w-100" style={{ maxWidth: "1100px" }}>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : filteredReviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            <table className="table table-bordered table-hover bg-white rounded shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product Image</th>
                  <th>Product ID</th>
                  <th>User Email</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Created At</th>
                  <th style={{ minWidth: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev, index) => (
                  <tr key={rev.id}>
                    <td>{index + 1}</td>
                    <td>
                      {rev.productImageUrl ? (
                        <img
                          src={getImageUrl(rev.productImageUrl)}
                          alt="Product"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{rev.productId}</td>
                    <td>{rev.userEmail}</td>
                    <td>{rev.rating}</td>
                    <td>{rev.comment}</td>
                    <td>{new Date(rev.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(rev.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReviews;
