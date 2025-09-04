import { useState, useEffect } from "react";
import ProductList from "../components/products/ProductList";
import { useWishlist } from "../context/WishlistContext";
import { useLocation } from "react-router-dom";

function Store({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [token, setToken] = useState(null);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const location = useLocation();
  const type = location.state?.type || "";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      fetch("http://localhost:5197/api/products")
        .then((res) => res.json())
        .then((data) => {
          const productsArray = data.$values || data.products || [];
          setProducts(productsArray);
        })
        .catch(console.error);
    }
  }, [location.state]);

  const handleAddToCart = (product, quantity = 1, size = "S") => {
    if (product.stock <= 0) return;
    const productToAdd = { ...product, quantity, size, productId: product.id };
    if (token) {
      return fetch("http://localhost:5197/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity, size }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to add to cart");
          const existing = cart.find((i) => i.productId === product.id && i.size === size);
          let updatedCart;
          if (existing) {
            updatedCart = cart.map((i) =>
              i.productId === product.id && i.size === size
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            updatedCart = [...cart, productToAdd];
          }
          setCart(updatedCart);
          return updatedCart;
        })
        .catch(console.error);
    } else {
      const existing = cart.find((i) => i.productId === product.id && i.size === size);
      let updatedCart;
      if (existing) {
        updatedCart = cart.map((i) =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updatedCart = [...cart, productToAdd];
      }
      setCart(updatedCart);
      localStorage.setItem(
        "guest_cart",
        JSON.stringify(
          updatedCart.map(({ productId, ...rest }) => ({ id: productId, ...rest }))
        )
      );
      return Promise.resolve(updatedCart);
    }
  };

  const sortedProducts = [...products];
  if (sortOrder === "asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  let productsWithBadge = sortedProducts.map((product) => {
    let badge = product.badge || "";
    if (type === "newarrivals") {
      const newestProduct = sortedProducts.reduce((latest, p) =>
        !latest || new Date(p.createdAt) > new Date(latest.createdAt) ? p : latest
      , null);
      if (newestProduct && product.id === newestProduct.id) badge = "New Arrival";
    }
    if (type === "bestsellers") {
      const bestsellersIds = new Set(sortedProducts.filter(p => p.badge === "Best Seller").map(p => p.id));
      if (bestsellersIds.has(product.id)) badge = "Best Seller";
    }
    if (product.stock <= 0) badge = "Out of Stock";
    return { ...product, badge };
  });

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

      <ProductList
        products={productsWithBadge}
        onAddToCart={handleAddToCart}
        onToggleWishlist={(product) =>
          isInWishlist(product.id)
            ? removeFromWishlist(product.id)
            : addToWishlist(product)
        }
        isFavorite={(product) => isInWishlist(product.id)}
      />
    </div>
  );
}

export default Store;
