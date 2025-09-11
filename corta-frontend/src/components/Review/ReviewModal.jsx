import React, { useState, useEffect } from "react";

const getImageUrl = (url) =>
  url ? (url.startsWith("http") ? url : `http://localhost:5197${url}`) : "/placeholder.jpg";

const ReviewModal = ({ product, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUser({
          name:
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            payload["unique_name"] ||
            "",
          email:
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
            payload["email"] ||
            "",
        });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to submit a review.");
      return;
    }

    const reviewData = {
      productId: product.id,
      rating,
      comment,
    };

    try {
      const res = await fetch("http://localhost:5197/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        setMessage("✅ Review added successfully!");
        setRating(0);
        setComment("");
      } else {
        const errorText = await res.text();
        console.error("Review submission failed:", errorText);
        setMessage("❌ Failed to add review.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("⚠️ Network error.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "transparent",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
          <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
        </div>
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                style={{
                  cursor: "pointer",
                  fontSize: "1.8rem",
                  color: starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9",
                }}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            );
          })}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Name</label>
          <input
            type="text"
            value={user.name}
            disabled
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Review</label>
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          ></textarea>
        </div>
        <button
          onClick={submitReview}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          SUBMIT
        </button>

        {message && (
          <p
            style={{
              marginTop: "10px",
              textAlign: "center",
              color: message.includes("successfully") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
