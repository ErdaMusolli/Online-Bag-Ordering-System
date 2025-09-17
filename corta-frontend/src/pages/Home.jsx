import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DiscountProducts from '../components/home/DiscountProducts';
import Store from './Store';
import api from '../services/apiClient'; 
import { useNavigate } from 'react-router-dom';
import CategoriesSection from '../components/home/CategoriesSection';

const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `https://localhost:7254${url.startsWith("/images/") ? url : `/images/${url}`}`;
};

export default function Home() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
     
  const navigate = useNavigate();

   useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [bestsellersRes, newArrivalsRes, allProductsRes] = await Promise.all([
          api.get('/products/bestsellers'),
          api.get('/products/newarrivals'),
          api.get('/products'),
        ]);
        const bestsellers = Array.isArray(bestsellersRes.data) ? bestsellersRes.data : bestsellersRes.data.$values || [];
        const newArrivalsData = Array.isArray(newArrivalsRes.data) ? newArrivalsRes.data : newArrivalsRes.data.$values || [];
        const allProductsData = Array.isArray(allProductsRes.data) ? allProductsRes.data : allProductsRes.data.$values || [];

        allProductsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

         if (!cancelled) {
          setAllProducts(allProductsData);
          setRecommendedProducts(bestsellers.map((p) => ({ ...p, badge: 'Best Seller' })));
          setNewArrivals(newArrivalsData.map((p) => ({ ...p, badge: 'New Arrival' })));
        }
      } catch (error) {
        if (!cancelled) console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          <div className="col-12 col-md-4 col-lg-3 mb-4">
            <CategoriesSection />  
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
                <img src={getImageUrl(product.imageUrl)} alt={product.name} className="card-img-top img-fluid" style={{ height: "auto", maxHeight: "250px", objectFit: "contain", backgroundColor: "#f8f9fa" }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.oldPrice && product.price < product.oldPrice ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">{Number(product.oldPrice).toFixed(2)}€</span>
                        <span className="fw-bold text-danger">{Number(product.price).toFixed(2)}€</span>
                      </>
                    ) : (
                      <span className="fw-bold">{Number(product.price).toFixed(2)}€</span>
                    )}
                  </p>
                  <button
                    onClick={() => product.stock > 0 && goToStore("bestsellers")}
                    className={`btn mt-auto ${product.stock > 0 ? 'btn-dark' : 'btn-secondary'}`}
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? "Shop Now" : "Out of Stock"}
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
                    <img src={getImageUrl(product.imageUrl)} alt={product.name} className="card-img-top img-fluid" style={{ height: "auto", maxHeight: "250px", objectFit: "contain", backgroundColor: "#f8f9fa" }} />
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{product.name}</h6>
                      <p className="card-text">
                        {product.oldPrice && product.price < product.oldPrice ? (
                          <>
                            <span className="text-muted text-decoration-line-through me-2">{Number(product.oldPrice).toFixed(2)}€</span>
                            <span className="fw-bold text-danger">{Number(product.price).toFixed(2)}€</span>
                          </>
                        ) : (
                          <span className="fw-bold">{Number(product.price).toFixed(2)}€</span>
                        )}
                      </p>
                      <button
                        onClick={() => product.stock > 0 && goToStore("newarrivals")}
                        className={`btn mt-auto ${product.stock > 0 ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? "Shop Now" : "Out of Stock"}
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
    </div>
  );
}
