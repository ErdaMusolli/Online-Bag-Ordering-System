import { useState, useEffect } from "react";
import CartItem from "../components/cart/CartItem";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return sum + price * qty;
  }, 0);

  return (
      <div
    style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: cartItems.length === 0 ? "center" : "flex-start",
      alignItems: "center",
      padding: "20px",
      paddingTop: "80px", 
      boxSizing: "border-box",
      backgroundColor: "#f8f9fa"
    }}
  >
    <h2 className="text-center my-4" style={{ fontFamily: 'Georgia, serif' }}>🛒 Shopping Cart</h2>

    {cartItems.length === 0 ? (
      <p>Your cart is empty.</p>
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
          <h4>Total: {totalPrice.toFixed(2)}€</h4>
        </>
      )}
    </div>
  );
}

export default Cart;