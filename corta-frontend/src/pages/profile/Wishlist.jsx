import React, { useContext, useState, useEffect } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { API_ORIGIN } from "../../services/apiClient";

const getImageUrl = (url) =>
  !url ? "/placeholder.jpg"
  : url.startsWith("http") ? url
  : new URL(url, API_ORIGIN).href;
  
const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { cartItems, addToCart } = useCart();
  const [wishlistCartIds, setWishlistCartIds] = useState([]);

  useEffect(() => {
    const ids = cartItems.map((item) => item.productId);
    setWishlistCartIds(ids);
  }, [cartItems]);

  const handleAddToCart = (item) => {
    addToCart(item, 1, "", true);
    removeFromWishlist(item.id);
  };

  return (
    <div className="wishlist-container">
      <h2 style={{ width: "100%", textAlign: "center", marginBottom: "40px", fontWeight: 600 }}>
        💖 Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div
          style={{
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
          <div key={item.id} className="wishlist-card-wrapper">
            <div className="card wishlist-card position-relative">
              <img src={getImageUrl(item.imageUrl)} alt={item.name} className="img-fluid" />

              {wishlistCartIds.includes(item.id) && (
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    color: "red",
                    fontSize: "1.2rem",
                  }}
                >
                  ❤️
                </span>
              )}

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

              <div className="card-body">
                <p className="card-title fw-bold mb-2">{item.name}</p>
                <p className="fw-semibold mb-3">
  {item.oldPrice && item.oldPrice > item.price && (
    <span className="text-muted text-decoration-line-through me-2">
      {Number(item.oldPrice).toFixed(2)}€
    </span>
  )}
  <span className="fw-bold">{Number(item.price).toFixed(2)}€</span>
</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                  className="btn btn-sm w-100"
                  style={{
                    backgroundColor: item.stock > 0 ? "#0d6efd" : "#6c757d",
                    color: "white",
                    border: "none",
                    cursor: item.stock > 0 ? "pointer" : "not-allowed",
                  }}
                  disabled={item.stock <= 0}
                >
                  {item.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
