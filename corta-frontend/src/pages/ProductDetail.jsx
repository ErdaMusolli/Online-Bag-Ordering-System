import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg"; 

  if (url.startsWith("http")) return url; 

  if (url.startsWith("/images/")) {
    return `http://localhost:5197${url}`;
  }

  return `http://localhost:5197/images/${url}`;
};

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("S");
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`http://localhost:5197/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const productImagesArray = Array.isArray(product.productImages)
    ? product.productImages
    : Array.isArray(product.productImages?.$values)
    ? product.productImages.$values
    : [];

  const images = [product.imageUrl, ...productImagesArray.map((pi) => pi.imageUrl)].filter(Boolean);

  const handlePrev = () => setMainIndex((mainIndex - 1 + images.length) % images.length);
  const handleNext = () => setMainIndex((mainIndex + 1) % images.length);

  const handleAddToCart = () => {
    try {
      addToCart(product, quantity, size);
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div className="container-fluid" style={{ paddingTop: "120px" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 mb-5">
          <div className="position-relative d-flex justify-content-center">
            <img
              src={getImageUrl(images[mainIndex])}
              alt={product.name}
              className="img-fluid"
              style={{
                borderRadius: "1.9rem",
                maxHeight: "600px",
                objectFit: "cover",
                boxShadow: "0 4px 8px rgba(128, 71, 119, 0.55)",
              }}
            />
            <button
              className="btn btn-sm btn-dark position-absolute top-50 start-0 translate-middle-y"
              style={{ opacity: 0.7 }}
              onClick={handlePrev}
            >
              &#8249;
            </button>
            <button
              className="btn btn-sm btn-dark position-absolute top-50 end-0 translate-middle-y"
              style={{ opacity: 0.7 }}
              onClick={handleNext}
            >
              &#8250;
            </button>
          </div>

          <div className="d-flex gap-2 flex-wrap justify-content-center mt-3">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
                alt={`${product.name}-${idx}`}
                className="img-thumbnail"
                style={{
                  cursor: "pointer",
                  width: "70px",
                  height: "80px",
                  objectFit: "cover",
                  border: idx === mainIndex ? "2px solid #60666dff" : "",
                }}
                onClick={() => setMainIndex(idx)}
              />
            ))}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <h4 className="text-primary mb-3">{product.price.toFixed(2)} €</h4>

          <div className="mb-3" style={{ maxWidth: "150px" }}>
            <label className="form-label">Size:</label>
            <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>

          <div className="mb-3" style={{ maxWidth: "150px" }}>
            <label className="form-label">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="form-control"
            />
          </div>

          <button
            className="btn btn-lg mb-2"
            onClick={handleAddToCart}
            style={{ backgroundColor: "#536487ff", color: "white", border: "#536487ff" }}
          >
            Add to Cart
          </button>

          <div>
            <h5 className="fw-bold">Description</h5>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
