import React, { createContext, useState, useEffect } from "react";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);


useEffect(() => {
  const loadCart = async () => {
    const userId = getUserIdFromToken();
    if (userId) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5197/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (err) {
        console.error("Failed to fetch cart from server:", err);
        setCartItems([]);
      }
    } else {
      const saved = localStorage.getItem("cart_guest");
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  };

  loadCart();
}, []);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      localStorage.setItem("cart_guest", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product, quantity, size) => {
    const productToAdd = { ...product, quantity, productId: product.id, size };
    const existing = cartItems.find(i => i.productId === product.id && i.size === size);

    if (existing) {
      setCartItems(prev =>
        prev.map(i =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setCartItems(prev => [...prev, productToAdd]);
    }

    const userId = getUserIdFromToken();
    if (userId) {
      const token = localStorage.getItem("token");
      try {
        await fetch("http://localhost:5197/api/cart/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ProductId: product.id,
            Quantity: quantity
          })
        });
      } catch (err) {
        console.error("Failed to add item to cart on server:", err);
      }
    }
  };

  const updateQuantity = async (productId, size, newQuantity) => {
    setCartItems(prev =>
      prev.map(i =>
        i.productId === productId && i.size === size ? { ...i, quantity: newQuantity } : i
      )
    );

    const userId = getUserIdFromToken();
    if (userId) {
      const token = localStorage.getItem("token");
      try {
        await fetch("http://localhost:5197/api/cart/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ProductId: productId,
            Quantity: newQuantity
          })
        });
      } catch (err) {
        console.error("Failed to update item quantity on server:", err);
      }
    }
  };

  const removeFromCart = async (productId, size) => {
    setCartItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));

    const userId = getUserIdFromToken();
    if (userId) {
      const token = localStorage.getItem("token");
      try {
        await fetch(`http://localhost:5197/api/cart/items/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to remove item from cart on server:", err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    const userId = getUserIdFromToken();
    if (!userId) {
      localStorage.removeItem("cart_guest");
    } else {
      const token = localStorage.getItem("token");
      try {
        await fetch("http://localhost:5197/api/cart", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to clear cart on server:", err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};
