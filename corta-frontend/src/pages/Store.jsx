import { useState, useEffect } from "react";
import ProductList from "../components/products/ProductList";

function Store() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5197/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleAddToCart = (product, quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;

    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="container-fluid mt-4 bg-light min-vh-100"style={{ paddingTop: '56px' }}>
      <h2 className="text-center my-4" style={{ fontFamily: 'Georgia, serif' }}>The Boutique</h2>


    <ProductList products={products} onAddToCart={handleAddToCart} />
    </div>
  );
}

export default Store;