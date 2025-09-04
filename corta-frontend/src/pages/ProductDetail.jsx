import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useGuestWishlist } from "../context/GuestWishlistContext";

const getImageUrl = (url) =>
  url ? (url.startsWith("http") ? url : `http://localhost:5197${url}`) : "/placeholder.jpg";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("S");
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { wishlist: guestWishlist, addToWishlist: addGuestWishlist, removeFromWishlist: removeGuestWishlist, isInWishlist: isInGuestWishlist } = useGuestWishlist();
  const token = localStorage.getItem("token");
  const [badge, setBadge] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5197/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        let newBadge = "";
        if (data.badge === "Best Seller") newBadge = "Best Seller";
        else if (data.badge === "New Arrival") newBadge = "New Arrival";
        setBadge(newBadge);
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const productImagesArray = Array.isArray(product.productImages)
    ? product.productImages
    : Array.isArray(product.productImages?.$values)
    ? product.productImages.$values
    : [];
  const images = [product.imageUrl, ...productImagesArray.map(pi => pi.imageUrl)].filter(Boolean);

  const isInUserWishlist = token ? isInWishlist(product.id) : isInGuestWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, size, isInUserWishlist);
    navigate("/cart");
  };

  const handleFavorite = () => {
    if (token) {
      isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
    } else {
      isInGuestWishlist(product.id) ? removeGuestWishlist(product.id) : addGuestWishlist(product);
    }
  };

  const handlePrev = () => setMainIndex((mainIndex - 1 + images.length) % images.length);
  const handleNext = () => setMainIndex((mainIndex + 1) % images.length);

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
            {badge && (
              <span
                className={`position-absolute top-0 start-0 m-2 px-2 py-1 rounded ${
                  badge === "Out of Stock" ? "bg-danger" : "bg-success"
                } text-white`}
              >
                {badge}
              </span>
            )}
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
         <div className="mb-3">
  {product.oldPrice && product.oldPrice > product.price && (
    <div className="text-muted text-decoration-line-through">
      {Number(product.oldPrice).toFixed(2)} €
    </div>
  )}
  <div className="fw-bold text-primary">
    {Number(product.price).toFixed(2)} €
  </div>
</div>
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

          <div className="gap-5 mt-5">
            <button
              className="btn btn-lg flex-grow-1"
              onClick={handleAddToCart}
              style={{
                backgroundColor: product.stock > 0 ? "#536487ff" : "#6c757d",
                color: "white",
                border: "none",
              }}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              className="btn btn-lg"
              onClick={handleFavorite}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1.5rem",
                padding: "0 12px",
                cursor: "pointer",
              }}
            >
              {isInUserWishlist ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="mt-3">
            <h5 className="fw-bold">Description</h5>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
