import React, { createContext, useContext, useState, useEffect } from "react";

export const GuestWishlistContext = createContext();
export const useGuestWishlist = () => useContext(GuestWishlistContext);

export const GuestWishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist_guest");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist_guest", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist(prev => [...prev, product]);
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };
  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

 return (
    <GuestWishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </GuestWishlistContext.Provider>
  );
};
