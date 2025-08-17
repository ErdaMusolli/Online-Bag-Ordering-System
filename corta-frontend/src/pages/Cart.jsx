import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from "../context/CartContext";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

function Cart() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = useContext(CartContext);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [popupSize, setPopupSize] = useState("");
  const [userId, setUserId] = useState(getUserIdFromToken());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = () => {
      const id = getUserIdFromToken();
      setUserId(id);

      const storedCart = JSON.parse(localStorage.getItem(id ? `cart_${id}` : "cart_guest") || "[]");
      setCartItems(storedCart);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setCartItems]);

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

  const recommendedProducts = [
    { id: 2, imageUrl: "Product2.jpg", name: "Urban Denim",  price: 68.0, sizes: ["S", "M", "L"] },
    { id: 6, imageUrl: "Product6.jpg", name: "Kyoto Bamboo Bag",  price: 65.0, sizes: ["S", "M", "L"] },
    { id: 3, imageUrl: "Product3.jpg", name: "Ocean Breeze Linen",  price: 76.0, sizes: ["S", "M", "L"] },
    { id: 1, imageUrl: "Product1.jpg", name: "Chic Corduroy Bag",  price: 65.0, sizes: ["S", "M", "L"] },
    { id: 5, imageUrl: "Product5.jpg", name: "Eco Cedar Bag",  price: 65.0, sizes: ["S", "M", "L"] },
    { id: 9, imageUrl: "Product9.jpg", name: "Seaside Linen Bag",  price: 70.0, sizes: ["S", "M", "L"] },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100vw", paddingBottom: "120px", backgroundColor: "#f8f9fa", paddingTop: "80px" }}>
      {hasCartItems && <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/store')}>← Store</button>}
      <h2 className="text-center my-4" style={{ fontFamily: "Georgia, serif" }}>🛒 Shopping Cart</h2>

      {!hasCartItems ? (
        <>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>Your cart is empty.</p>
            <button
              onClick={handleShopNow}
              style={{ padding: "12px 25px", fontSize: "16px", fontWeight: "600", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Shop Now
            </button>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3>Recommended for you</h3>
            <div className="row g-3 justify-content-center">
              {recommendedProducts.map(prod => (
                <div key={prod.id} className="col-md-4">
                  <div className="card p-3 h-100" style={{ cursor: "pointer" }} onClick={() => { setPopupProduct(prod); setPopupVisible(true); }}>
                    <img src={`/${prod.imageUrl}`} alt={prod.name} className="img-fluid" style={{ borderRadius: "6px", marginBottom: "8px", objectFit: "cover", height: "600px", width: "100%" }} />
                    <p style={{ fontWeight: "600", fontSize: "16px" }}>{prod.name}</p>
                    <p style={{ color: "#007bff", fontWeight: "bold" }}>{prod.price.toFixed(2)}€</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <CartItem key={index} item={item} onRemove={removeFromCart} onQuantityChange={updateQuantity} />
          ))}
          <hr />
          <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "white", borderTop: "1px solid #ddd", padding: "10px 20px", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1000 }}>
            <div style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "600", color: "#004085" }}>Total: {totalPrice.toFixed(2)}€</div>
            <button
              onClick={handleCheckout}
              style={{ width: "100%", padding: "15px", fontSize: "18px", fontWeight: "bold", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              Checkout
            </button>
          </div>
        </>
      )}

      {popupVisible && popupProduct && (
        <div
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}
          onClick={() => setPopupVisible(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", maxWidth: "400px", width: "90%", textAlign: "center" }}
          >
            <img src={`/${popupProduct.imageUrl}`} alt={popupProduct.name} style={{ width: "100%", maxHeight: "250px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f0f0f0" }} />
            <h3 style={{ marginTop: "15px" }}>{popupProduct.name}</h3>
            <p style={{ fontWeight: "bold", color: "#007bff" }}>{popupProduct.price.toFixed(2)}€</p>

            {popupProduct.sizes && popupProduct.sizes.length > 0 && (
              <select value={popupSize} onChange={e => setPopupSize(e.target.value)} style={{ marginTop: "10px", padding: "6px 12px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" ,backgroundColor:"#ccc",color:"#351919ff"}}>
                {popupProduct.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
              <button onClick={() => setPopupQuantity(q => Math.max(1, q - 1))} style={{ padding: '8px 12px', fontSize: '18px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#bfbfbf', border: 'none', borderRadius: '4px' }}>-</button>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>{popupQuantity}</span>
              <button onClick={() => setPopupQuantity(q => q + 1)} style={{ padding: '8px 12px', fontSize: '18px', marginLeft: '10px', cursor: 'pointer', backgroundColor: '#bfbfbf', border: 'none', borderRadius: '4px' }}>+</button>
            </div>

            <button
              onClick={() => { addToCart(popupProduct, popupQuantity, popupSize); setPopupVisible(false); }}
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
