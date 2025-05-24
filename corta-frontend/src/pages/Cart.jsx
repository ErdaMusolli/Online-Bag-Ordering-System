import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (updatedCart.length === 0) {
      navigate("/store");
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    navigate("/store");
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return sum + price * qty;
  }, 0);

  const handleCheckout = () => {
    navigate("/checkout"); 
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        paddingBottom: "120px",
        boxSizing: "border-box",
        backgroundColor: "#f8f9fa",
        paddingTop: "80px",
      }}
    >
      <h2
        className="text-center my-4"
        style={{
          fontFamily: "Georgia, serif",
          textAlign: "center",
        }}
      >
        🛒 Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <CartItem
              key={index}
              item={item}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
          <hr />
        </>
      )}

      {cartItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "white",
            borderTop: "1px solid #ddd",
            padding: "10px 20px",
            boxSizing: "border-box",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#004085",
            }}
          >
            Total: {totalPrice.toFixed(2)}€
          </div>
          <button
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#0056b3")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#007bff")
            }
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;



