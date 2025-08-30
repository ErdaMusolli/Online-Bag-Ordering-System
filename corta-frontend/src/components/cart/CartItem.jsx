import React from "react";

const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg"; 
  if (url.startsWith("http")) return url; 
  if (url.startsWith("/images/")) return `http://localhost:5197${url}`;
  return `http://localhost:5197/images/${url}`;
};

function CartItem({ item, onRemove, onQuantityChange, fromWishlist = false, toggleWishlist }) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.productId, item.size, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.productId, item.size, item.quantity + 1);
  };

    return (
    <div className="cart-item-card" style={{ position: "relative" }}>
  <img
    src={getImageUrl(item.imageUrl)}
    alt={item.name}
    className="cart-item-image"
  />

  <div className="cart-item-details">
    <div className="d-flex justify-content-between align-items-center">
      <h5>{item.name}</h5>
      {item.fromWishlist && (
            <span style={{ fontSize: "1.5rem", color: "red" }}>❤️</span>
          )}
        </div>

    {item.size && <p style={{ fontSize: "14px", color: "#555" }}>Size: {item.size}</p>}
    <p style={{ fontWeight: "bold" }}>Price: {item.price.toFixed(2)} €</p>

    <div className="d-flex align-items-center gap-2 mt-2">
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={handleDecrease}
        disabled={item.quantity <= 1}
      >
        -
      </button>
      <span>Quantity: {item.quantity}</span>
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  </div>

  <button
    className="btn btn-danger cart-item-delete"
    onClick={() => onRemove(item.productId, item.size)}
  >
    Delete
  </button>
</div>

  );
}

export default CartItem;
