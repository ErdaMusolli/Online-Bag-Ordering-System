import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_ORIGIN } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";
import { useCart  } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useGuestWishlist } from "../context/GuestWishlistContext";
import ReviewModal from "../components/review/ReviewModal";
 

const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  const rel = url.startsWith("/images/") ? url : `/images/${url}`;
  return new URL(rel, API_ORIGIN).href;
};

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("S");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();   
  
  const authWishlist   = useWishlist();
  const guestWishlist  = useGuestWishlist();
  const wishlistCtx    = isAuthenticated ? authWishlist : guestWishlist;
  
  const { addToCart } = useCart();
  const [badge, setBadge] = useState("");
  const [showReview, setShowReview] = useState(false);


   useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data;
        if (cancelled) return;
        setProduct(data);
        setBadge(
          data.badge === "Best Seller"
            ? "Best Seller"
            : data.badge === "New Arrival"
            ? "New Arrival"
            : (data.stock ?? data.Stock) <= 0
            ? "Out of Stock"
            : ""
        );
        const sizes = Array.isArray(data.sizes) && data.sizes.length ? data.sizes : ["S", "M", "L"];
        setSize(sizes[0]);
      } catch (e) {
        if (!cancelled) console.error("Failed to fetch product:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  const pid = product.id ?? product.Id;
  const name = product.name ?? product.Name ?? "Product";
  const price = product.price ?? product.Price ?? 0;
  const stock = product.stock ?? product.Stock ?? 0;

  const productImagesArray = Array.isArray(product.productImages)
    ? product.productImages
    : Array.isArray(product.productImages?.$values)
    ? product.productImages.$values
    : [];

  const images = [product.imageUrl, ...productImagesArray.map((pi) => pi.imageUrl)]
    .filter(Boolean)
    .map(getImageUrl);

  const handleAddToCart = async () => {
    if (stock <= 0) return;

    addToCart({ ...product, id: pid, price }, quantity, size);

    if (isAuthenticated) {
      try {
        await api.post("/cart/items", { productId: pid, quantity, size }); 
      } catch (err) {
        console.warn("Server cart add failed; UI mirrored locally.", err);
      }
    } else {
    }

    navigate("/cart");
  };

  const inWishlist = wishlistCtx?.isInWishlist?.(pid);

const handleFavorite = () => {
  if (!wishlistCtx) return;
  if (wishlistCtx.isInWishlist?.(pid)) {
    wishlistCtx.removeFromWishlist?.(pid);
  } else {
    wishlistCtx.addToWishlist?.(product);
  }
};

  const handlePrev = () => setMainIndex((idx) => (images.length ? (idx - 1 + images.length) % images.length : 0));
  const handleNext = () => setMainIndex((idx) => (images.length ? (idx + 1) % images.length : 0));

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
              {inWishlist  ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="mt-3">
            <h5 className="fw-bold">Description</h5>
            <p>{product.description}</p>
          </div>
<div className="mt-4">
  <button

  onClick={() => setShowReview(true)}
  className="btn"
  style={{
    backgroundColor: "#2563EB",
    color: "white",
    borderRadius: "8px",
    border: "none",
    padding: "10px 20px",
    fontWeight: "500",
  }}
>
    Leave Review
  </button>

  {showReview && (
    <ReviewModal
      product={product}
      onClose={() => setShowReview(false)}
    />
  )}
</div>


        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
