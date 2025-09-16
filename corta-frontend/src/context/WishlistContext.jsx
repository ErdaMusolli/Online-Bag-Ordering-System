import React, { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../services/authFetch";           
import { getNewAccessToken } from "../services/tokenUtils";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
 
  useEffect(() => {
  const loadWishlist = async () => {
   const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token && !refreshToken) {
        const saved = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
        setWishlist(Array.isArray(saved) ? saved : []);
        return;
      }

      localStorage.removeItem("guest_wishlist");

       try {
        let res = await authFetch("http://localhost:5197/api/wishlist", { method: "GET" });

        if (res?.status === 401) {
          const newToken = await getNewAccessToken();
          if (!newToken) {
            console.error("Wishlist GET failed: 401 (no refresh token or refresh failed)");
            setWishlist([]);
            return;
          }
          res = await fetch("http://localhost:5197/api/wishlist", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }

        if (!res || !res.ok) {
          const text = res ? await res.text() : "no response";
          console.error("Wishlist GET failed:", res?.status, text);
          setWishlist([]);
          return;
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          console.error("Wishlist GET non-JSON:", ct, text);
          setWishlist([]);
          return;
        }

        const data = await res.json();
        const products = Array.isArray(data.$values) ? data.$values : [];
        const formatted = products.map(p => ({
          id: p.productId,
          name: p.productName,
          imageUrl: p.productImageUrl,
          price: p.price || 0,
          stock: p.stock || 0,
          createdAt: p.createdAt
        }));

        setWishlist(formatted);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      }
  };

  loadWishlist();
}, []);

  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

     if (!token && !refreshToken) {
      setWishlist((prev) => {
        if (!prev.find((p) => p.id === product.id)) {
          const updated = [...prev, product];
          localStorage.setItem("guest_wishlist", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
      return;
    }

      try {
         const res = await authFetch("http://localhost:5197/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });

       if (!res.ok) {
        const text = await res.text();
        console.error("Wishlist POST failed:", res.status, text);
        return;
      }
        setWishlist(prev => {
          if (!prev.find(p => p.id === product.id)) return [...prev, product];
          return prev;
        });
      } catch (err) {
        console.error("Error adding to wishlist:", err);
      }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

     if (!token && !refreshToken) {
      setWishlist((prev) => {
        const updated = prev.filter((p) => p.id !== productId);
        localStorage.setItem("guest_wishlist", JSON.stringify(updated));
        return updated;
      });
      return;
    }

      try {
      const res = await authFetch(`http://localhost:5197/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Wishlist DELETE failed:", res.status, text);
      }
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }

    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId) => Array.isArray(wishlist) && wishlist.some(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
