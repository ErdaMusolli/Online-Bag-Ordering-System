import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const loadWishlist = async () => {
    if (token) {
      localStorage.removeItem("guest_wishlist");

      try {
        const res = await fetch("http://localhost:5197/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const products = Array.isArray(data.$values) ? data.$values : [];
        const formatted = products.map(p => ({
          id: p.productId,
          name: p.productName,
          imageUrl: p.productImageUrl,
          price: p.price || 0,
          createdAt: p.createdAt
        }));

        setWishlist(formatted);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      }
    } else {
      const saved = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
      setWishlist(Array.isArray(saved) ? saved : []);
    }
  };

  loadWishlist();
}, [token]);

  const addToWishlist = async (product) => {
    if (token) {
      try {
        await fetch(`http://localhost:5197/api/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id }),
        });
        setWishlist(prev => {
          if (!prev.find(p => p.id === product.id)) return [...prev, product];
          return prev;
        });
      } catch (err) {
        console.error("Error adding to wishlist:", err);
      }
    } else {
      setWishlist(prev => {
        if (!prev.find(p => p.id === product.id)) {
          const updated = [...prev, product];
          localStorage.setItem("guest_wishlist", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (token) {
      try {
        await fetch(`http://localhost:5197/api/wishlist/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }
    }

    setWishlist(prev => {
      const updated = prev.filter(p => p.id !== productId);
      if (!token) localStorage.setItem("guest_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId) => Array.isArray(wishlist) && wishlist.some(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
