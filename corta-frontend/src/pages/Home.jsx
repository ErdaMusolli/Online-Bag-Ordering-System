import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DiscountProducts from '../components/home/DiscountProducts';
import StarRating from '../components/StarRating';
import Store from './Store';
import ContactForm from '../components/ContactForm/ContactForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getImageUrl = (url) => url ? `http://localhost:5197${url}` : '/placeholder.jpg';

const categories = [
  { id: 1, name: 'Tote Bags', image: '/images/71d52e53-dc7c-44cf-9ae5-f80b677a93b9.jpg' },
  { id: 2, name: 'Denim Bags', image: '/images/71d52e53-dc7c-44cf-9ae5-f80b677a93b9.jpg' },
  { id: 3, name: 'Linen Bags', image: '/images/71d52e53-dc7c-44cf-9ae5-f80b677a93b9.jpg' },
  { id: 4, name: 'Canvas Bags', image: '/images/71d52e53-dc7c-44cf-9ae5-f80b677a93b9.jpg' },
  { id: 5, name: 'Bamboo Bags', image: '/images/71d52e53-dc7c-44cf-9ae5-f80b677a93b9.jpg' },
];

export default function Home() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
      const bestsellersRes = await axios.get('http://localhost:5197/api/products/bestsellers');
      const newArrivalsRes = await axios.get('http://localhost:5197/api/products/newarrivals');
      const allProductsRes = await axios.get('http://localhost:5197/api/products');

      const bestsellers = Array.isArray(bestsellersRes.data) ? bestsellersRes.data : bestsellersRes.data.$values || [];
      const newArrivalsData = Array.isArray(newArrivalsRes.data) ? newArrivalsRes.data : newArrivalsRes.data.$values || [];
      const allProductsData = Array.isArray(allProductsRes.data) ? allProductsRes.data : allProductsRes.data.$values || [];

      allProductsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllProducts(allProductsData);
      setRecommendedProducts(bestsellers.map(p => ({ ...p, badge: "Best Seller" })));
      setNewArrivals(newArrivalsData.map(p => ({ ...p, badge: "New Arrival" })));
    } catch (error) {
      console.error(error);
    }
  }
  fetchProducts();
}, []);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput }]);
      setChatInput('');
    }
  };

  const goToStore = (type) => {
    let products = allProducts.map(p => ({ ...p }));
    if (type === "bestsellers") {
      const bestsellersIds = new Set(recommendedProducts.map(p => p.id));
      products = products.map(p => bestsellersIds.has(p.id) ? { ...p, badge: "Best Seller" } : p);
      products.sort((a, b) => bestsellersIds.has(b.id) - bestsellersIds.has(a.id));
    } else if (type === "newarrivals") {
      const newArrivalsIds = new Set(newArrivals.map(p => p.id));
      products = products.map(p => newArrivalsIds.has(p.id) ? { ...p, badge: "New Arrival" } : p);
      products.sort((a, b) => newArrivalsIds.has(b.id) - newArrivalsIds.has(a.id));
    } 
    navigate("/store", { state: { products, type } });
  };

  return (
  <div className="bg-light min-vh-100" style={{ overflowX: "hidden", width: "100%", paddingTop: "60px" }}>
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <h4 className="mb-4 text-center">Categories</h4>
          <div className="d-flex justify-content-center flex-wrap gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                style={{ width: "100%", maxWidth: "120px", cursor: "pointer", textAlign: "center" }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    margin: "0 auto",
                  }}
                >
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <p className="mt-2">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-8">
          <DiscountProducts />
        </div>
      </div>
    </div>

    <section className="container px-2 my-5">
      <h4 className="mb-3">Bestsellers</h4>
      <div className="row">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="col-6 col-md-4 col-lg-3 mb-3">
            <div className="card shadow-sm h-100 border-0">
             <img
  src={getImageUrl(product.imageUrl)}
  alt={product.name}
  className="card-img-top img-fluid"
  style={{
    height: "auto",
    maxHeight: "250px",
    objectFit: "contain",
    backgroundColor: "#f8f9fa"
  }}
/>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
  {product.oldPrice && product.price < product.oldPrice ? (
    <>
      <span className="text-muted text-decoration-line-through me-2">
        {Number(product.oldPrice).toFixed(2)}€
      </span>
      <span className="fw-bold text-danger">
        {Number(product.price).toFixed(2)}€
      </span>
      <span className="badge bg-danger ms-2">Special Offer</span>
    </>
  ) : (
    <span className="fw-bold">{Number(product.price).toFixed(2)}€</span>
  )}
</p>

                <button onClick={() => goToStore("bestsellers")} className="btn btn-dark mt-auto">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="container px-3 my-5">
      {newArrivals.length > 0 && (
        <>
          <h2 className="mb-4">New Arrivals</h2>
          <div className="row">
            {newArrivals.map((product) => (
              <div key={product.id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <div className="card shadow-sm h-100">
                 <img
  src={getImageUrl(product.imageUrl)}
  alt={product.name}
  className="card-img-top img-fluid"
  style={{
    height: "auto",
    maxHeight: "250px",
    objectFit: "contain",
    backgroundColor: "#f8f9fa"
  }}
/>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.name}</h6>
                    <p className="card-text">
  {product.oldPrice && product.price < product.oldPrice ? (
    <>
      <span className="text-muted text-decoration-line-through me-2">
        {Number(product.oldPrice).toFixed(2)}€
      </span>
      <span className="fw-bold text-danger">
        {Number(product.price).toFixed(2)}€
      </span>
      <span className="badge bg-danger ms-2">Special Offer</span>
    </>
  ) : (
    <span className="fw-bold">{Number(product.price).toFixed(2)}€</span>
  )}
</p>

                    <button onClick={() => goToStore("newarrivals")} className="btn btn-primary mt-auto">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
    <Store />
    <StarRating />
    <section className="container my-5">
      <ContactForm />
    </section>

    <div className="position-fixed bottom-0 end-0 m-4" style={{ maxWidth: "100%" }}>
      {!chatOpen ? (
        <button className="btn btn-dark rounded-circle p-3" onClick={() => setChatOpen(true)}>
          💬
        </button>
      ) : (
        <div className="card shadow" style={{ width: "100%", maxWidth: 320 }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Chat with us</strong>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setChatOpen(false)}>
              ×
            </button>
          </div>
          <div className="card-body" style={{ maxHeight: 220, overflowY: "auto" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className="mb-2">
                <small className="text-muted">You:</small> {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="card-footer d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-dark">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  </div>
)
}