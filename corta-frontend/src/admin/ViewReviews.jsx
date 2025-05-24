import React, { useEffect, useState } from "react";

const ViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5197/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:5197/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews(reviews.filter((rev) => rev.id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
      <h2 className="text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>
        ⭐ Product Reviews
      </h2>

      <div className="w-100" style={{ maxWidth: "1000px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white rounded shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Product ID</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th style={{ minWidth: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id}>
                    <td>{rev.id}</td>
                    <td>{rev.productId}</td>
                    <td>{rev.userId}</td>
                    <td>{rev.rating}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteReview(rev.id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default ViewReviews;
