import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DiscountProducts from '../components/home/DiscountProducts';
import StarRating from '../components/StarRating'; 
import Store from './Store'; 
import ContactForm from '../components/ContactForm/ContactForm';



const categories = [
  { id: 1, name: 'Tote Bags', image: '/Product1.jpg' },
  { id: 2, name: 'Dresses', image: '/Product2.jpg' },
  { id: 3, name: 'Beach Bags', image: '/Product3.jpg' },
  { id: 4, name: 'Shoes' , image: '/Product6.jpg'},
  { id: 5, name: 'Jeans' , image: '/Product8.jpg'},

];
const recommendedProducts = [
  { id: 1, name: 'Organic Backpack', price: '$49', image: '/Product4.jpg' },
  { id: 2, name: 'Travel Duffel', price: '$79', image: '/Product5.jpg' },
  { id: 3, name: 'Reusable Tote', price: '$29', image: '/Product6.jpg' },
];
const newArrivals = [
  { id: 101, name: 'New Eco Bag', price: '$59', image: '/Product7.jpg' },
  { id: 102, name: 'Stylish Travel Bag', price: '$89', image: '/Product8.jpg' },
  { id: 103, name: 'Compact Tote', price: '$39', image: '/Product9.jpg' },
];

const specialOffers = [
  { id: 201, name: 'Limited Edition Backpack', originalPrice: '$99', discountedPrice: '$79', image: '/Product10.jpg' },
  { id: 202, name: 'Small backpack', originalPrice: '$25', discountedPrice: '$19', image: '/Product12.jpg' },
];



export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput }]);
      setChatInput('');
    }
  };

  return (
    <div
      className="bg-light min-vh-100"
      style={{ overflowX: 'hidden', width: '100vw', paddingTop: '60px' }}
    >
      <div className="container my-5">
        <div className="row align-items-center">
        
          <div className="col-lg-4">
            <h4 className="mb-4 text-center">Categories</h4>
            <div
    className="d-flex justify-content-center flex-wrap gap-4"
    style={{ gap: '1.5rem' }}
  >
    {categories.map((category) => (
      <div
         key={category.id}
  style={{
    width: '120px',
    cursor: 'pointer',
    textAlign: 'center',
  }}
>
  <div
    style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      margin: '0 auto',
    }}
  >
    <img
      src={category.image}
      alt={category.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
           <section className="container px-3 my-5">
        <h4 className="mb-4 ">Bestsellers</h4>
        <div className="row">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100" style={{ backgroundColor: 'transparent', border: 'none' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text fw-bold">{product.price}</p>
                  <a href="/store" className="btn btn-dark mt-auto">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
       <section className="container px-3 my-5">
        <h2 className="mb-4">New Arrivals</h2>
        <div className="row">
          {newArrivals.map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card shadow-sm h-90">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text fw-bold">{product.price}</p>
                  <a href="/store" className="btn btn-primary mt-auto">Buy Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
       <section className="container px-3 my-5 bg-light p-4 rounded">
        <h2 className="mb-4 text-danger">Special Offers</h2>
        <div className="row">
          {specialOffers.map(product => (
            <div key={product.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100 d-flex flex-row">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '180px', objectFit: 'cover' }}
                  className="rounded-start"
                />
                <div className="card-body d-flex flex-column justify-content-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p>
                    <span className="text-muted text-decoration-line-through me-2">
                      {product.originalPrice}
                    </span>
                    <span className="fw-bold text-danger">{product.discountedPrice}</span>
                  </p>
                  <a href="/store" className="btn btn-danger mt-auto">Shop Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <Store />
      
       <StarRating />
       <section className="container my-5">
        <ContactForm />
      </section>

      

      <div className="position-fixed bottom-0 end-0 m-4">
        {!chatOpen ? (
          <button
            className="btn btn-dark rounded-circle p-3"
            onClick={() => setChatOpen(true)}
          >
            💬
          </button>
        ) : (
          <div className="card shadow" style={{ width: 320 }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>Chat with us</strong>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setChatOpen(false)}
              >
                ×
              </button>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: 220, overflowY: 'auto' }}
            >
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
  );
}