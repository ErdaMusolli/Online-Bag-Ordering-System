import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const GUEST_CART_KEY = "guest_cart";

function normalizeItem(it) {
  return {
    cartItemId: it.cartItemId ?? it.id ?? Math.random().toString(36).slice(2),
    productId: it.productId ?? it.id,
    name: it.productName ?? it.name ?? "",
    imageUrl: it.productImageUrl ?? it.imageUrl ?? null,
    price: Number(it.price ?? 0),
    quantity: Number(it.quantity ?? 1),
    stock: Number(it.stock ?? 0),
    variant: it.variant ?? it.size ?? "",
  };
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let canceled = false;

      const loadCart = async () => {
      if (!isAuthenticated) {
        
      try {
          const raw =
            localStorage.getItem(GUEST_CART_KEY) ??
            localStorage.getItem("cart_guest"); 
          const parsed = raw ? JSON.parse(raw) : [];
          if (!canceled && Array.isArray(parsed) && parsed.length) {
            setCartItems(parsed.map(normalizeItem));
          } else if (!canceled) {
            setCartItems([]);
          }
        } catch {
          if (!canceled) setCartItems([]);
        } finally {
          if (!canceled) setHydrated(true);
        }
        return;
      }

      try {
      const { data } = await api.get("/cart");
        const raw =
          Array.isArray(data) ? data
          : Array.isArray(data?.items) ? data.items
          : Array.isArray(data?.Items) ? data.Items                 
          : Array.isArray(data?.items?.$values) ? data.items.$values
          : Array.isArray(data?.Items?.$values) ? data.Items.$values
          : Array.isArray(data?.$values) ? data.$values
          : [];
       if (!canceled) setCartItems(raw.map(normalizeItem));
      } catch (e) {
        if (!canceled) console.error("Cart GET error:", e);
      } finally {
        if (!canceled) setHydrated(true);
      }
    };

    loadCart();
  return () => {
      canceled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    } catch {
    }
   }
  }, [cartItems, hydrated,isAuthenticated]);

  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const addToCart = async (product, quantity = 1, variant = "") => {
    setCartItems((prev) => {
      const found = prev.find((i) => i.productId === product.id && i.variant === variant);
      return found
        ? prev.map((i) =>
            i.productId === product.id && i.variant === variant
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [
            ...prev,
            normalizeItem({
              id: product.id,
              productId: product.id,
              name: product.name,
              imageUrl: product.imageUrl ?? null,
              price: product.price ?? 0,
              quantity,
              stock: product.stock ?? 0,
              variant,
            }),
          ];
    });

    if (!isAuthenticated) return;

    try {
      await api.post("/cart/items", {
        productId: product.id,
        quantity,
        size: variant,
      });
    } catch (e) {
      console.error("Cart POST failed:", e);
    }
  };


  const removeFromCart = async (productId, variant = "") => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.productId === productId && (variant ? i.variant === variant : true)))
    );

    if (!isAuthenticated) return;

    try {
     await api.delete(`/cart/items/${productId}`);
    } catch (e) {
      console.error("Cart DELETE failed:", e);
    }
  };

  const updateQuantity = async (productId, quantity, variant = "") => {
    quantity = Math.max(0, Number(quantity) || 0);

    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && (variant ? i.variant === variant : true)
          ? { ...i, quantity }
          : i
      )
    );

    if (quantity === 0) {
       await api.delete(`/cart/items/${productId}`);
     } else {
       await api.post("/cart/items", { productId, quantity, size: variant });
     }
  };

  const clearCart = async () => {
    setCartItems([]);

    if (!isAuthenticated) {
      try {
        localStorage.removeItem(GUEST_CART_KEY);
      } catch {}
      return;
    }

     try {
      await api.delete("/cart");
    } catch (e) {
      console.error("Cart clear failed:", e);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
