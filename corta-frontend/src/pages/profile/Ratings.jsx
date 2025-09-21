import React, { useEffect, useState } from "react";
import api from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

const ASSET_HOST = "https://localhost:7254";
const getImageUrl = (url) =>
  url ? (url.startsWith("http") ? url : `${ASSET_HOST}${url}`) : "/placeholder.jpg";

const Ratings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/reviews/me");
        if (cancelled) return;

        const raw = Array.isArray(data?.$values)
          ? data.$values
          : Array.isArray(data)
          ? data
          : [];

        const mapped = raw.map((r) => ({
          id: r.id ?? r.Id,
          productId: r.productId ?? r.ProductId,
          rating: r.rating ?? r.Rating,
          comment: r.comment ?? r.Comment,
          createdAt: r.createdAt ?? r.CreatedAt,
          productImageUrl: r.productImageUrl ?? r.ProductImageUrl,
        }));

        setReviews(mapped);
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        const msg = err?.response?.data || err.message || "Could not load ratings";
        setError(typeof msg === "string" ? msg : "Could not load ratings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < count ? "#ffc107" : "#e4e5e9", fontSize: "1.2rem" }}>
        ★
      </span>
    ));
  };

  if (loading) return <div className="p-4">Loading your ratings...</div>;

  return (
    <div
      style={{
        width: "68vw",
        minHeight: "100vh",
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="card p-4 shadow-sm">
        <h4 className="mb-4">⭐ My Ratings</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {reviews.length === 0 ? (
          <p>You haven’t given any ratings yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white rounded">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product Image</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev, index) => (
                  <tr key={rev.id}>
                    <td>{index + 1}</td>
                    <td>
                      {rev.productImageUrl ? (
                        <img
                          src={getImageUrl(rev.productImageUrl)}
                          alt=""
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{renderStars(rev.rating)}</td>
                    <td>{rev.comment}</td>
                    <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
