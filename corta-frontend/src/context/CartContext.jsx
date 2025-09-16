import React, { createContext, useContext, useEffect, useState } from "react";
import { authFetch } from "../services/authFetch";
import { getNewAccessToken } from "../services/tokenUtils";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const GUEST_CART_KEY = "guest_cart";

function getUserIdFromToken() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const p = JSON.parse(atob(t.split(".")[1]));
    const raw =
      p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      p["UserId"] ||
      p["sub"];
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

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
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const uid = getUserIdFromToken();
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!uid) {
        const guestRaw =
          localStorage.getItem(GUEST_CART_KEY) ??
          localStorage.getItem("cart_guest");
        const guestSaved = guestRaw ? JSON.parse(guestRaw) : [];
        if (Array.isArray(guestSaved) && guestSaved.length) {
          setCartItems(guestSaved.map(normalizeItem));
        }
      }

      if (!token && !refreshToken) {
        setHydrated(true);
        return;
      }

      try {
        let res = await authFetch("http://localhost:5197/api/cart", { method: "GET" });

        if (res?.status === 401) {
          const newTok = await getNewAccessToken();
          if (!newTok) {
            setHydrated(true);
            return;
          }
          res = await fetch("http://localhost:5197/api/cart", {
            headers: { Authorization: `Bearer ${newTok}` },
          });
        }

        if (!res?.ok) {
          setHydrated(true);
          return;
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          setHydrated(true);
          return;
        }

        const data = await res.json();
        const raw =
          Array.isArray(data) ? data
          : Array.isArray(data?.items) ? data.items
          : Array.isArray(data?.Items) ? data.Items                 
          : Array.isArray(data?.items?.$values) ? data.items.$values
          : Array.isArray(data?.Items?.$values) ? data.Items.$values
          : Array.isArray(data?.$values) ? data.$values
          : [];
        setCartItems(raw.map(normalizeItem));
      } catch (e) {
        console.error("Cart GET error:", e);
      } finally {
        setHydrated(true);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const uid = getUserIdFromToken();
    if (!uid) localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const addToCart = async (product, quantity = 1, variant = "") => {
    const uid = getUserIdFromToken();

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

    if (!uid) return;

    try {
      const res = await authFetch("http://localhost:5197/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ ProductId: product.id, Quantity: quantity, Variant: variant }),
      });
      if (!res.ok) console.error("Cart POST failed:", res.status, await res.text());
    } catch (e) {
      console.error("Cart add error:", e);
    }
  };

  const removeFromCart = async (productId, variant = "") => {
    const uid = getUserIdFromToken();

    setCartItems((prev) =>
      prev.filter((i) => !(i.productId === productId && (variant ? i.variant === variant : true)))
    );

    if (!uid) return;

    try {
      const res = await authFetch(`http://localhost:5197/api/cart/items/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) console.error("Cart DELETE failed:", res.status, await res.text());
    } catch (e) {
      console.error("Cart remove error:", e);
    }
  };

  const updateQuantity = async (productId, quantity, variant = "") => {
    const uid = getUserIdFromToken();

    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && (variant ? i.variant === variant : true)
          ? { ...i, quantity }
          : i
      )
    );

    if (!uid) return;

    try {
      await authFetch(`http://localhost:5197/api/cart/items/${productId}`, { method: "DELETE" });
      if (quantity > 0) {
        await authFetch("http://localhost:5197/api/cart/items", {
          method: "POST",
          body: JSON.stringify({ ProductId: productId, Quantity: quantity, Variant: variant }),
        });
      }
    } catch (e) {
      console.error("Cart updateQuantity error:", e);
    }
  };

  const clearCart = async () => {
    const uid = getUserIdFromToken();

    setCartItems([]);
    if (!uid) {
      localStorage.removeItem(GUEST_CART_KEY);
      return;
    }

     try {
      const res = await authFetch("http://localhost:5197/api/cart", {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Cart clear failed:", res.status, await res.text());
      }
    } catch (e) {
      console.error("Cart clear error:", e);
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
