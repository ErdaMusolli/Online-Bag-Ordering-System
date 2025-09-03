import React, { useContext, useState, useEffect } from "react";
import { useGuestWishlist } from "../context/GuestWishlistContext";
import { CartContext } from "../context/CartContext";

const getImageUrl = (url) =>
  url ? (url.startsWith("http") ? url : `http://localhost:5197${url}`) : "/placeholder.jpg";

const GuestWishlist = () => {
  const { wishlist, removeFromWishlist } = useGuestWishlist();
  const { cartItems, addToCart } = useContext(CartContext);
  const [wishlistCartIds, setWishlistCartIds] = useState([]);

  useEffect(() => {
    const guestCart = JSON.parse(localStorage.getItem("cart_guest") || "[]");
    const ids = [...cartItems, ...guestCart].map(item => item.productId);
    setWishlistCartIds(ids);
  }, [cartItems]);

  const handleAddToCart = (item) => {
    addToCart(item, 1, "", true);
    removeFromWishlist(item.id);
    setWishlistCartIds(prev => [...new Set([...prev, item.id])]); 
  };

  return (
  <div
    style={{
      minHeight: "calc(100vh - 120px)",
      padding: "80px 20px",
      backgroundColor: "#f8f9fa",
      width: "95%",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1rem",
    }}
  >
    <h2
      style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        marginBottom: "40px",
        fontWeight: 600,
      }}
    >
      💖 Wishlist
    </h2>

    {wishlist.length === 0 ? (
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "1.3rem",
          fontWeight: 500,
          color: "#6c757d",
          width: "100%",
        }}
      >
        Your wishlist is empty.
      </div>
    ) : (
      wishlist.map((item) => (
        <div
          key={item.id}
          className="card h-100 shadow-sm position-relative"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.name}
            className="img-fluid"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "350px",
              objectFit: "contain",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromWishlist(item.id);
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ❤️
          </button>

          <div className="card-body text-center">
            <p className="card-title fw-bold mb-2">{item.name}</p>
            <p className="fw-semibold mb-3">
              {typeof item.price === "number"
                ? item.price.toFixed(2)
                : "—"}
              €
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
              className="btn btn-sm btn-primary w-100"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

};

export default GuestWishlist;
