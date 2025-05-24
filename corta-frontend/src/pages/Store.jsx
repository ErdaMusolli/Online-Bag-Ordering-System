import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from '../components/StarRating'; 
 
function Store() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
  fetch("http://localhost:5197/api/Products")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    })
    .then((data) => {
      const products = [
  { id: 1, imageUrl: "Product1.jpg", name: "Chic Corduroy Bag", description: "100% Organic Cotton Canvas", price: "$65.00", quantity: 6 },
  { id: 2, imageUrl: "Product2.jpg", name: "Urban Denim", description: "100% Organic Cotton Denim", price: "$68.00", quantity: 3 },
  { id: 3, imageUrl: "Product3.jpg", name: "Ocean Breeze Linen", description: "100% Organic Cotton Denim", price: "$76.00", quantity: 7 },
  { id: 4, imageUrl: "Product4.jpg", name: "Canvas Coast", description: "100% Organic Cotton Convas", price: "$60.00", quantity: 7 },
  { id: 5, imageUrl: "Product5.jpg", name: "Eco Cedar Bag", description: "100% Organic Cotton Cedar", price: "$65.00", quantity: 7 },
  { id: 6, imageUrl: "Product6.jpg", name: "Kyoto Bamboo Bag", description: "100% Organic Cotton Bamboo", price: "$65.00", quantity: 7 },
  { id: 7, imageUrl: "Product7.jpg", name: "Denim Wanderer", description: "100% Organic Cotton Denim", price: "$48.00", quantity: 7 },
  { id: 8, imageUrl: "Product8.jpg", name: "Bamboo Temple", description: "100% Organic Cotton Bamboo", price: "$50.00", quantity: 7 },
  { id: 9, imageUrl: "Product9.jpg", name: "Seaside Linen Bag", description: "100% Organic Cotton Linen", price: "$70.00", quantity: 7 },
  { id: 10, imageUrl: "Product10.jpg", name: "Cityscape Bag", description: "100% Organic Cotton Canvas", price: "$60.00", quantity: 7 },
  { id: 11, imageUrl: "Product11.jpg", name: "Pocket Prairie Bag", description: "100% Organic Cotton Canvas", price: "$42.00", quantity: 7 },
  { id: 12, imageUrl: "Product12.jpg", name: "Canvas Trail Bag", description: "100% Organic Cotton Canvas", price: "$58.00", quantity: 7 }
];


      setProducts(data.$values || []);
    })
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
  };
 
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });
 
  return (
    <div className="container-fluid mt-4 bg-light min-vh-100" style={{ paddingTop: '56px' }}>
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
    <h1 className="text-center flex-grow-1 mb-3 mb-md-0" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          The Boutique
    </h1>
    <select
     className="form-select form-select-sm w-auto"
     style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}
     value={sortOrder}
     onChange={(e) => setSortOrder(e.target.value)}
>
    <option value="">Sort by Price</option>
    <option value="asc">Lowest to Highest</option>
    <option value="desc">Highest to Lowest</option>
    </select>
     </div>
 
    <div className="row g-3">
     {sortedProducts.map(product => (
    <div key={product.id} className="col-md-4">
    <div className="card p-3 h-100">
    <img src={product.imageUrl} alt={product.name} className="img-fluid" />
    <h5>{product.name}</h5>
    <p>{product.description}</p>
    <p><strong>{product.price}€</strong></p>
 
    <div className="d-flex align-items-center mt-2">
    <label htmlFor={`qty-${product.id}`} className="me-2 mb-0">Quantity:</label>
    <input
    id={`qty-${product.id}`}
    type="number"
    min="1"
    defaultValue="1"
    className="form-control"
    style={{ width: '60px' }}
     onChange={(e) => product.quantity = parseInt(e.target.value)}
/>
    </div>
 
    <div className="d-flex justify-content-between align-items-center mt-2">
    <button
    className="btn btn-primary"
    onClick={() => handleAddToCart(product, product.quantity || 1)}
>
     Add to Cart
   </button>
   <div style={{ marginLeft: '10px' }}>
   <StarRating productId={product.id} />
   </div>
   </div>
   </div>
   </div>
   ))}
   </div>
   </div>
  );
}
 
export default Store;