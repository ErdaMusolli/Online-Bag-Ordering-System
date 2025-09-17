import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

const GUEST_KEY = "guest_wishlist";

function safeLoad() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function safeSave(val) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(val));
  } catch {
  }
}

function normalize(p) {
  const id = p.productId ?? p.id;
  return {
    id,
    name: p.productName ?? p.name ?? "",
    imageUrl: p.productImageUrl ?? p.imageUrl ?? null,
    price: Number(p.price ?? p.product?.price ?? 0),
    stock: Number(p.stock ?? p.product?.stock ?? 0),
    createdAt: p.createdAt,
  };
}

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

 useEffect(() => {
    let canceled = false;
    (async () => {
      if (!isAuthenticated) {
        const saved = safeLoad();
        if (!canceled) setWishlist(Array.isArray(saved) ? saved : []);
        return;
      }
      localStorage.removeItem(GUEST_KEY);
      try {
        const { data } = await api.get("/wishlist");
        const list = Array.isArray(data?.$values) ? data.$values : Array.isArray(data) ? data : [];
        const formatted = list.map(normalize);
        if (!canceled) setWishlist(formatted);
      } catch (err) {
        if (!canceled) {
          console.error("Wishlist GET failed:", err);
          setWishlist([]);
        }
      }
    })();
    return () => { canceled = true; };
 }, [isAuthenticated]);

 useEffect(() => {
    if (!isAuthenticated) safeSave(wishlist);
  }, [wishlist, isAuthenticated]);

   const addToWishlist = async (product) => {
    const item = normalize(product);
    const pid = Number(item.id);
    if (!pid) return;

    const already = wishlist.some((p) => p.id === pid);
    if (!already) {
      setWishlist((prev) => [...prev, item]);
    }

    if (!isAuthenticated) return; 

    try {
      await api.post("/wishlist", { productId: pid });
      return;
    } catch (err) {
      const msg =
        (err && err.response && err.response.data && err.response.data.message) || "";
      if (err?.response?.status === 400 && /already/i.test(msg)) {
        return;
      }
      if (!already) {
        setWishlist((prev) => prev.filter((p) => p.id !== pid));
      }
      console.error("Wishlist POST failed:", (err && err.response && err.response.data) || err);
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));

    if (!isAuthenticated) return;

    try {
      await api.delete(`/wishlist/${productId}`);
    } catch (err) {
      console.error("Wishlist DELETE failed:", err);
    }
  };

  const isInWishlist = (productId) =>
    Array.isArray(wishlist) && wishlist.some((p) => p.id === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

