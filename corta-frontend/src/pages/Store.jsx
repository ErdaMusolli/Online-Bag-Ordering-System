import { useState, useEffect, useMemo } from "react";
import ProductList from "../components/products/ProductList";
import { useWishlist } from "../context/WishlistContext";
import { useLocation } from "react-router-dom";
import api from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

function Store({ cart = [], setCart = () => {} }) {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
 
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const location = useLocation();

  const qs = new URLSearchParams(location.search);
  const searchTerm = (qs.get("search") || "").toLowerCase();
  const category = (qs.get("category") || "").toLowerCase(); 
  const fabric   = (qs.get("fabric")   || "").toLowerCase();

 useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await api.get("/products", {
          signal: controller.signal,
          params: {
            ...(category ? { category } : {}),
            ...(fabric ? { fabric } : {}),
          },
        });
        const data = res.data;
        const arr = data.$values || data.products || data || [];
        setProducts(arr);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error(err);
        }
        setProducts([]);
      }
    })();
    return () => controller.abort();
  }, [category, fabric]);


const sorted = useMemo(() => {
  const copy = [...products];
  const toNum = (v) => (v == null ? 0 : Number(v));

  if (sortOrder === "asc")  copy.sort((a, b) => toNum(a.price) - toNum(b.price));
  if (sortOrder === "desc") copy.sort((a, b) => toNum(b.price) - toNum(a.price));

  return copy;
}, [products, sortOrder]);

const productsWithBadges = useMemo(() => {
  const arr = (location.state?.products || sorted)
    .map(p => {
      let badge;

      if (location.state?.type === "bestsellers" && p.badge === "Best Seller") {
        badge = "Best Seller";
      } else if (location.state?.type === "newarrivals" && p.badge === "New Arrival") {
        badge = "New Arrival";
      }

      if (p.stock <= 0) badge = "Out of Stock";

      return { ...p, badge };
    })
    .filter(p => {
      const matchesSearch = searchTerm
        ? p.name.toLowerCase().includes(searchTerm)
        : true;

      const categorySlug = p.category?.slug?.toLowerCase().trim() || "";
      const selectedCategory = category ? category.toLowerCase().trim() : "";

      const matchesCategory = selectedCategory
        ? categorySlug === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });

  if (location.state?.type === "bestsellers") {
    arr.sort((a, b) => (b.badge === "Best Seller" ? 1 : 0) - (a.badge === "Best Seller" ? 1 : 0));
  } else if (location.state?.type === "newarrivals") {
    arr.sort((a, b) => (b.badge === "New Arrival" ? 1 : 0) - (a.badge === "New Arrival" ? 1 : 0));
  }

  return arr;
}, [sorted, location.state, searchTerm, category]);

 const handleAddToCart = async (product, quantity = 1, size = "S") => {
    if (product.stock <= 0) return;

     const productToAdd = { ...product, quantity, size, productId: pid, price };

    if (isAuthenticated) {
      try {
        await api.post("/cart/items", { productId: pid, quantity, size }); 
        const existing = cart.find((i) => i.productId === pid && i.size === size);
        const updated = existing
          ? cart.map((i) =>
              i.productId === pid && i.size === size
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [...cart, productToAdd];
        setCart(updated);
        return updated;
      } catch (err) {
        console.error("Failed to add to cart", err);
        return;
      }
    } else {
      const existing = cart.find((i) => i.productId === pid && i.size === size);
      const updated = existing
        ? cart.map((i) =>
            i.productId === pid && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...cart, productToAdd];
      setCart(updated);
      localStorage.setItem(
        "guest_cart",
        JSON.stringify(updated.map(({ productId, ...rest }) => ({ id: productId, ...rest })))
      );
      return updated;
    }
  };

  return (
    <div className="store-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 w-100">
        <h1 className="text-center flex-grow-1 mb-3 mb-md-0" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          The Boutique
        </h1>
        <select
          className="form-select form-select-sm w-auto"
          style={{ fontSize: "1.1rem", padding: "0.37rem 1.8rem", borderRadius: "1rem", fontFamily: "'Roboto', sans-serif" }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="asc">Price: Lowest to Highest</option>
          <option value="desc">Price: Highest to Lowest</option>
        </select>
      </div>
    {productsWithBadges.length === 0 ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '50vh', width: '100%' }}
    >
      <p className="fs-4 text-center">No products found</p>
    </div>
  ) : (
    <ProductList
      products={productsWithBadges}
      onAddToCart={handleAddToCart}
      onToggleWishlist={(product) =>
        isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)
      }
      isFavorite={(product) => isInWishlist(product.id)}
    />
  )}
</div>
  );
}

export default Store;