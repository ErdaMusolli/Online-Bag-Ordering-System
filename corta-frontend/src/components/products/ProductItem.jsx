import { useState } from "react";

function ProductItem({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const imagePath = `/${product.imageUrl}`;

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val >= 1) {
      setQuantity(val);
    }
  };

  return (
    <div className="card h-100">
      <img src={imagePath} className="card-img-top img-fluid" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text fw-bold">{product.price}€</p>
        <div className="mb-2 d-flex align-items-center">
  <label htmlFor={`quantity-${product.id}`} className="me-2">
    Quantity:
  </label>
  <input
    type="number"
    id={`quantity-${product.id}`}
    min="1"
    value={quantity}
    onChange={handleQuantityChange}
    className="form-control form-control-sm"
    style={{
      width: "80px",
      backgroundColor: "#f8f9fa",
      color: "#212529"
    }}
  />
</div>

        <button className="btn btn-primary" onClick={() => onAddToCart(product, quantity)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductItem;
