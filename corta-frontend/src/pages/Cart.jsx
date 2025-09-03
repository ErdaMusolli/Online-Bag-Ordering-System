import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useGuestWishlist } from "../context/GuestWishlistContext";

const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg"; 
  if (url.startsWith("http")) return url; 
  return `http://localhost:5197${url.startsWith("/images/") ? url : `/images/${url}`}`;
};

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

function Cart() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [popupSize, setPopupSize] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const wishlistContext = token ? useWishlist() : useGuestWishlist();
  const { wishlist } = wishlistContext;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5197/api/products");
        if (res.ok) {
          const data = await res.json();
          const list = data?.$values ?? data;
          const productsWithSizes = (Array.isArray(list) ? list : []).map(p => ({
            ...p,
            sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["S", "M", "L"] 
          }));
          setProducts(productsWithSizes);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (popupProduct) {
      setPopupQuantity(1);
      setPopupSize(popupProduct.sizes?.[0] || "");
    }
  }, [popupProduct]);

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1),
        0
      )
    : 0;

  const hasCartItems = Array.isArray(cartItems) && cartItems.length > 0;
  const handleCheckout = () => navigate("/checkout");
  const handleShopNow = () => navigate("/store");
  const recommendedProducts = Array.isArray(products) ? products.slice(0, 6) : [];

  return (
    <div style={{ minHeight: "100vh", width: "100%", paddingBottom: "160px", backgroundColor: "#f8f9fa", paddingTop: "80px" }}>
      {hasCartItems && (
        <button className="btn btn-outline-secondary mb-3" onClick={() => window.history.back()}>
          ← Store
        </button>
      )}

      <h2 className="text-center my-4" style={{ fontFamily: "Georgia, serif" }}>
        🛒 Shopping Cart
      </h2>

      {!hasCartItems ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>Your cart is empty.</p>
          <button
            onClick={handleShopNow}
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Shop Now
          </button>

          {products && products.length > 0 && (
            <div style={{ marginTop: "60px" }}>
              <h3>Recommended for you</h3>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {products.slice(0, 6).map((prod) => {
                  const isInWishlist = wishlistContext.isInWishlist(prod.id);
                  const handleFavorite = (e) => {
                    e.stopPropagation();
                    if (isInWishlist) wishlistContext.removeFromWishlist(prod.id);
                    else wishlistContext.addToWishlist(prod);
                  };
                  return (
                    <div
                      key={prod.id}
                      className="card p-2 position-relative"
                      style={{
                        width: "160px",
                        cursor: "pointer",
                        flex: "1 1 150px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        setPopupProduct(prod);
                        setPopupVisible(true);
                      }}
                    >
                      <img
                        src={getImageUrl(prod.imageUrl)}
                        alt={prod.name}
                        className="img-fluid"
                        style={{ width: "100%", height: "160px", objectFit: "contain", marginBottom: "8px" }}
                      />
                      <p style={{ fontWeight: "600", fontSize: "14px", textAlign: "center" }}>{prod.name}</p>
                      <p style={{ color: "#007bff", fontWeight: "bold", fontSize: "14px" }}>{prod.price.toFixed(2)}€</p>
                      <button
                        onClick={handleFavorite}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "transparent",
                          border: "none",
                          fontSize: "1.2rem",
                          cursor: "pointer",
                        }}
                      >
                        {isInWishlist ? "❤️" : "🤍"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container">
          <div className="row g-3">
            {cartItems.map((item, index) => (
              <div key={index} className="col-12">
                <CartItem
                  item={item}
                  onRemove={removeFromCart}
                  onQuantityChange={updateQuantity}
                  fromWishlist={!!item.fromWishlist}
                  toggleWishlist={() => {
                    if (wishlistContext.isInWishlist(item.productId)) wishlistContext.removeFromWishlist(item.productId);
                    else {
                      const product = products.find((p) => p.id === item.productId);
                      if (product) wishlistContext.addToWishlist(product);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {hasCartItems && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "white",
            borderTop: "1px solid #ddd",
            padding: "10px 15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#004085", marginBottom: "8px" }}>
            Total: {totalPrice.toFixed(2)}€
          </div>
          <button
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Checkout
          </button>
        </div>
      )}

      {popupVisible && popupProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setPopupVisible(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", maxWidth: "400px", width: "90%", textAlign: "center" }}
          >
            <img
              src={getImageUrl(popupProduct.imageUrl)}
              alt={popupProduct.name}
              style={{ width: "100%", maxHeight: "250px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f0f0f0" }}
            />
            <h3 style={{ marginTop: "15px" }}>{popupProduct.name}</h3>
            <p style={{ fontWeight: "bold", color: "#007bff" }}>{popupProduct.price.toFixed(2)}€</p>

            {popupProduct.sizes && popupProduct.sizes.length > 0 && (
              <select
                value={popupSize}
                onChange={(e) => setPopupSize(e.target.value)}
                style={{ marginTop: "10px", padding: "6px 12px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
              >
                {popupProduct.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
              <button
                onClick={() => setPopupQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: "8px 12px", fontSize: "18px", marginRight: "10px", cursor: "pointer", backgroundColor: "#bfbfbf", border: "none", borderRadius: "4px" }}
              >
                -
              </button>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>{popupQuantity}</span>
              <button
                onClick={() => setPopupQuantity((q) => q + 1)}
                style={{ padding: "8px 12px", fontSize: "18px", marginLeft: "10px", cursor: "pointer", backgroundColor: "#bfbfbf", border: "none", borderRadius: "4px" }}
              >
                +
              </button>
            </div>

           <button
  onClick={async () => {
    await addToCart(popupProduct, popupQuantity, popupSize);
    setPopupVisible(false);
  }}
  style={{ marginTop: "15px", padding: "12px 25px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}
>
  Add to Cart
</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;