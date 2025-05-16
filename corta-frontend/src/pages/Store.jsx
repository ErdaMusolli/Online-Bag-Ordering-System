import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import ProductList from "../components/products/ProductList";

function Store() {
  const [products, setProducts] = useState([
  {
    id: 1,
    name: "Chic Corduroy Bag",
    price: 65.00,
    description: "100% Organic Cotton Corduroy Bag",
    stock:6,
    imageUrl: "Product1.jpg", 
  },
  {
    id: 2,
    name: "Urban Denim Bag",
    description: "100% Organic Cotton Denim",
    price: 68.00,
    stock:3,
    imageUrl: "Product2.jpg"
  },
  {
    id: 3,
    name: "Ocean Breeze Linen Bag",
    description: "100% Organic Linen",
    price: 76.00,
    stock:7,
    imageUrl: "Product3.jpg"
  },
  {
    id: 4,
    name: "Canvas Coast Bag",
    description: "100% Organic Cotton Canvas",
    price: 55.00,
    stock:7,
    imageUrl: "Product4.jpg"
  },
  {
    id: 5,
    name: "Eco Cedar Bag",
    description: "100% Organic Cotton Corduroy",
    price: 60.00,
    stock:7,
    imageUrl: "Product5.jpg"
  },
  {
    id: 6,
    name: "Kyoto Bamboo Bag",
    description: "100% Organic Bamboo",
    price: 63.00,
    stock:7,
    imageUrl: "Product6.jpg"
  },
  {
    id: 7,
    name: "Denim Wanderer Bag",
    description: "100% Organic Cotton Denim",
    price: 48.00,
    stock:7,
    imageUrl: "Product7.jpg"
  },
  {
    id: 8,
    name: "Bamboo Temple Bag",
    description: "100% Organic Bamboo",
    price: 65.00,
    stock:7,
    imageUrl: "Product8.jpg"
  },
  {
    id: 9,
    name: "Seaside Linen Bag",
    description: "100% Organic Linen",
    price: 70.00,
    stock:7,
    imageUrl: "Product9.jpg"
  },
  {
    id: 10,
    name: "Corduroy Terra Bag",
    description: "100% Organic Cotton Corduroy",
    price: 60.00,
    stock:7,
    imageUrl: "Product10.jpg"
  },
  {
    id: 11,
    name: "Cityscape Bag",
    description: "100% Organic Cotton Canvas",
    price: 60.00,
    stock:7,
    imageUrl: "Product11.jpg"
  },
  {
    id: 12,
    name: "Pocket Prairie Bag",
    description: "100% Organic Cotton Canvas",
    price: 42.00,
    stock:7,
    imageUrl: "Product12.jpg"
  },
  {
    id: 13,
    name: "Canvas Trail Bag",
    description: "100% Organic Cotton Canvas",
    price: 58.00,
    stock:7,
    imageUrl: "Product13.jpg"
  },
]);
const navigate = useNavigate();

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
    navigate("/cart");
    setTimeout(() => {
      navigate("/cart");
    }, 7000);
  };

  return (
    <div className="container-fluid mt-4 bg-light min-vh-100"style={{ paddingTop: '56px' }}>
      <h2 className="text-center my-4" style={{ fontFamily: 'Georgia, serif' }}>The Boutique</h2>


    <ProductList products={products} onAddToCart={handleAddToCart} />
    </div>
  );
}

export default Store;