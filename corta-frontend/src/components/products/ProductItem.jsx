import { useNavigate } from "react-router-dom";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const imagePath = `/${product.imageUrl}`;

  return (
    <div
      className="card h-100"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={imagePath}
        alt={product.name}
        className="card-img-top img-fluid"
        style={{ objectFit: "cover", height: "450px" }}
      />
      <div className="card-body text-center">
        <h5 className="card-title">{product.name}</h5>
        <p className="fw-bold">{product.price.toFixed(2)}€</p>
      </div>
    </div>
  );
}

export default ProductItem;
