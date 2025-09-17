import { useNavigate } from "react-router-dom";
import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useGuestWishlist } from "../../context/GuestWishlistContext";
import { useAuth } from "../../context/AuthContext";

const ASSET_HOST = "https://localhost:7254";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const userW   = useWishlist();
  const guestW  = useGuestWishlist();

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    isAuthenticated ? userW : guestW;

   const imagePath = product?.imageUrl
    ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${ASSET_HOST}${product.imageUrl}`)
    : "/placeholder.jpg";

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
   <div
  className="card h-100"
  style={{ cursor: "pointer", position: "relative" }}  
  onClick={() => navigate(`/product/${product.id}`)}
>
      {product.badge && (
        <span
          className="position-absolute top-0 start-0 m-2"
          style={{
            backgroundColor: "#c0b7b6ff",
            color: "#fff",
            fontSize: "0.95rem",
            padding: "0.35em 0.65em",
            borderRadius: "0.5rem",
            zIndex: 2,
          }}
        >
          {product.badge}
        </span>
      )}

      <div
        className="w-100"
        style={{ aspectRatio: "4 / 5", background: "#f8f9fa", overflow: "hidden" }}
      >
       <img
        src={imagePath}
        alt={product.name}
        loading="eager"
        onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `${ASSET_HOST}/images/placeholder.jpg`;
    }}
    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
  />
</div>

      <button
        onClick={handleWishlistClick}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
      >
        {isInWishlist(product.id) ? "❤️" : "🤍"}
      </button>
      <div className="card-body text-center">
  <h5 className="card-title">{product.name}</h5>
  <p className="fw-bold">
    {product.oldPrice && product.oldPrice > 0 && product.oldPrice !== product.price && (
      <span style={{ textDecoration: 'line-through', color: '#6c757d', marginRight: '5px' }}>
        {product.oldPrice.toFixed(2)}€
      </span>
    )}
    <span style={{ color: '#007bff' }}>{product.price.toFixed(2)}€</span>
  </p>
</div>
    </div>
  );
}

export default ProductItem;
