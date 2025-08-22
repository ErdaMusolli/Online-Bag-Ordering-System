import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DiscountProducts from '../components/home/DiscountProducts';
import StarRating from '../components/StarRating'; 
import Store from './Store'; 
import ContactForm from '../components/ContactForm/ContactForm';

const getImageUrl=(url)=> url ? `http://localhost:5197${url}` : '/placeholder.jpg';


const categories = [
   { id: 1, name: 'Tote Bags', image: '/images/7f1beec4-d7f0-4129-a692-daa239b24bfa.jpg' },
  { id: 2, name: 'Denim Bags', image: '/images/1af37744-7d3d-4c60-88f5-3e766924adec.jpg' },
  { id: 3, name: 'Linen Bags', image: '/images/7f16e966-7aff-44c7-99c2-680196ebdfbc.jpg' },
  { id: 4, name: 'Canvas Bags', image: '/images/833bc46a-9a54-4bcd-b3c3-5cd5d0d88088.jpg' },
  { id: 5, name: 'Bamboo Bags', image: '/images/c67b8146-0d72-4b1f-918a-f4947e3b73b7.jpg' },
];
const recommendedProducts = [
  { id: 1, name: 'Chic Corduroy Bag', price: '$65', image: '/images/7f1beec4-d7f0-4129-a692-daa239b24bfa.jpg' },
  { id: 2, name: 'Urban Denim Bag', price: '$65', image: '/images/1af37744-7d3d-4c60-88f5-3e766924adec.jpg' },
  { id: 3, name: 'Ocean Breeze Linen Bag', price: '$70', image: '/images/7f16e966-7aff-44c7-99c2-680196ebdfbc.jpg' },
]
const newArrivals = [
    { id: 101, name: 'Canvas Coast Bag', price: '$55', image: '/images/833bc46a-9a54-4bcd-b3c3-5cd5d0d88088.jpg' },
  { id: 102, name: 'Eco Cedar Bag', price: '$58', image: '/images/4089e5b6-daba-46b1-8593-7470d6bb1d6f.jpg' },
  { id: 103, name: 'Kyoto Bamboo Bag', price: '$60', image: '/images/c67b8146-0d72-4b1f-918a-f4947e3b73b7.jpg' },
];

const specialOffers = [
   { id: 201, name: 'Denim Wanderer Bag', originalPrice: '$50', discountedPrice: '$42', image: '/images/5d98c398-b310-437f-b692-ccc3d3c573ef.jpg' },
  { id: 202, name: 'Bamboo Temple Bag', originalPrice: '$70', discountedPrice: '$65', image: '/images/ec168d28-9c53-41ab-93d2-e1a625d69984.jpg' },
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
  src={getImageUrl(category.image)}
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
  src={getImageUrl(product.image)}
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
                   src={getImageUrl(product.image)}
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
                   src={getImageUrl(product.image)}
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