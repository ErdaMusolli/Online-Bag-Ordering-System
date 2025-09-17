import React from "react";

const ASSET_HOST = "https://localhost:7254";
const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/images/")) return `${ASSET_HOST}${url}`;
  return `${ASSET_HOST}/images/${url}`;
};;

function CartItem({ item, onRemove, onQuantityChange, fromWishlist = false, toggleWishlist }) {
  const size = item?.variant ?? item?.size ?? "S";
  const quantity = Number(item?.quantity ?? 1);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.productId, item.size, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.productId, item.size, item.quantity + 1);
  };
  
 const handleRemove = () => {
    onRemove?.(item.productId, size);
  };

   return (
    <div className="cart-item-card" style={{ position: "relative" }}>
      <img
        src={getImageUrl(item.imageUrl)}
        alt={item.name}
        className="cart-item-image"
        style={{ width: "200px", height: "200px", objectFit: "contain" }}
      />

      <div className="cart-item-details">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h5 style={{ marginBottom: "0.5rem" }}>{item.name}</h5>
          {fromWishlist && <span style={{ fontSize: "1.5rem", color: "red" }}>❤️</span>}
        </div>

        {item.size && (
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "0.25rem" }}>
            Size: {item.size}
          </p>
        )}

        <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
  {item.oldPrice && item.price < item.oldPrice ? (
    <>
      <span
        style={{
          textDecoration: "line-through",
          color: "#6c757d",
          marginRight: "5px"
        }}
      >
        {item.oldPrice.toFixed(2)} €
      </span>
      <span>{item.price.toFixed(2)} €</span>
    </>
  ) : (
    <span>{item.price.toFixed(2)} €</span>
  )}
</p>


        <div className="d-flex align-items-center gap-2 flex-wrap">
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
        className="btn btn-danger cart-item-delete mt-2 mt-md-0"
        onClick={() => onRemove(item.productId, item.size)}
      >
        Delete
      </button>
    </div>
  );
}

export default CartItem;