import { useNavigate } from "react-router-dom";
import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useGuestWishlist } from "../../context/GuestWishlistContext";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const wishlistContext = token ? useWishlist() : useGuestWishlist();
  const { addToWishlist, removeFromWishlist, isInWishlist } = wishlistContext;

  const imagePath =
    product.imageUrl && product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `http://localhost:5197${product.imageUrl}`;

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
      className="card h-100 position-relative"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {product.badge && (
  <span
    className="position-absolute top-0 start-0 m-2"
    style={{
      backgroundColor: "#c0b7b6ff", 
      color: "#fff",              
      fontSize: "1.1rem",         
      padding: "0.35em 0.65em",   
      borderRadius: "0.5rem"     
    }}
  >
    {product.badge}
  </span>
)}
      <img
        src={imagePath}
        alt={product.name}
        className="card-img-top img-fluid"
        style={{ objectFit: "cover", height: "450px" }}
      />
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
