import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from '../components/StarRating'; 
 
function Store() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    setToken(savedToken);
    setIsLoggedIn(true);
  }
}, []);
 
   useEffect(() => {
    fetch("http://localhost:5197/api/Products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.$values || []);
      const initialQuantities = {};
        (data.$values || []).forEach(p => {
          initialQuantities[p.id] = 1;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("Error:", err));
  }, []);


 
  const handleAddToCart = (product, quantity) => {
  quantity = parseInt(quantity);
  if (isNaN(quantity) || quantity < 1) quantity = 1;

  if (isLoggedIn && token) {
    fetch("http://localhost:5197/api/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id,
        quantity,
      }),
    })
    .then(() => {
      navigate("/cart");
    })
    .catch((err) => console.error("Error adding to backend cart:", err));
  } else {
    let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    const index = guestCart.findIndex(item => item.productId === product.id);
    if (index !== -1) {
      guestCart[index].quantity += quantity;
    } else {
      guestCart.push({ ...product, productId: product.id, quantity });
    }
    localStorage.setItem("guest_cart", JSON.stringify(guestCart));
    navigate("/cart");
  }
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
    <img src={`/${product.imageUrl}`} alt={product.name} className="img-fluid" />
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