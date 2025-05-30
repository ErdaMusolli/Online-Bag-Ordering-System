import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import 'bootstrap/dist/css/bootstrap.min.css';


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState(1); 
  const [hasCartItems, setHasCartItems] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setIsLoggedIn(true);
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetch("http://localhost:5197/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
            if (data?.items?.$values && Array.isArray(data.items.$values)) {
            setCartItems(data.items.$values);
          } else if (Array.isArray(data)) {
            setCartItems(data);
          } else {
            setCartItems([]);
          }
          localStorage.removeItem("guest_cart");
        })
        .catch(err => {
          console.error("Error fetching cart:", err);
          setCartItems([]);
        });
    } else {
      const guestCartRaw = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const guestCart = guestCartRaw.map(item => ({
        ...item,
        productId: item.productId ?? item.id, 
      }));
      setCartItems(guestCart);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (popupProduct) setPopupQuantity(1);
  }, [popupProduct]);

  useEffect(() => {
    setHasCartItems(cartItems.length > 0);
  }, [cartItems]);

  const saveToLocalStorage = (updatedCart) => {
    const toSave = updatedCart.map(({ productId, ...rest }) => ({ id: productId, ...rest }));
    localStorage.setItem("guest_cart", JSON.stringify(toSave));
  };
  

const handleRemove = (productId) => {
   if (!productId) {
    console.error("Error: productId është undefined ose null");
    return;
  }

    if (isLoggedIn) {
      fetch(`http://localhost:5197/api/cart/items/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          setCartItems(cartItems.filter(item => item.productId !== productId));
        })
        .catch(console.error);
    } else {
      const updatedCart = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCart);
      saveToLocalStorage(updatedCart);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (isLoggedIn) {
      fetch("http://localhost:5197/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      })
        .then(() => {
          const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
          );
          setCartItems(updatedCart);
        })
        .catch(console.error);
    } else {
      const updatedCart = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      saveToLocalStorage(updatedCart);
    }
  };


   const handleClearCart = () => {
    if (isLoggedIn) {
      fetch("http://localhost:5197/api/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => setCartItems([]))
        .catch(console.error);
    } else {
      localStorage.removeItem("guest_cart");
      setCartItems([]);
    }
    navigate("/store");
  };

  const addToCart = (product, quantity = 1) => {
    if (isLoggedIn) {
      fetch("http://localhost:5197/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      }) .then(() => {
          const existing = cartItems.find(i => i.productId === product.id);
          let updatedCart;
          if (existing) {
            updatedCart = cartItems.map(i =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            updatedCart = [...cartItems, { ...product, quantity, productId: product.id }];
          }
          setCartItems(updatedCart);
          setPopupVisible(false);
        })
        .catch(console.error);
    } else {
      const existingItem = cartItems.find(item => item.productId === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = cartItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: (Number(item.quantity) || 1) + quantity }
            : item
        );
      } else {
        updatedCart = [...cartItems, { ...product, quantity, productId: product.id }];
      }
      setCartItems(updatedCart);
      saveToLocalStorage(updatedCart);
      setPopupVisible(false);
    }
  };

  const totalPrice = Array.isArray(cartItems)
  ? cartItems.reduce((sum, item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      return sum + price * qty;
    }, 0)
  : 0;


  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleShopNow = () => {
    navigate("/store");
  };
  

  const recommendedProducts = [
      { id: 8, imageUrl: "Product2.jpg", name: "Urban Denim", description: "100% Organic Cotton Denim", price: 68.0, quantity: 3 },
      { id: 9, imageUrl: "Product6.jpg", name: "Kyoto Bamboo Bag", description: "100% Organic Cotton Bamboo", price: 65.0, quantity: 7 },
      { id: 10, imageUrl: "Product3.jpg", name: "Ocean Breeze Linen", description: "100% Organic Cotton Denim", price: 76.0, quantity: 7 },
      { id: 11, imageUrl: "Product1.jpg", name: "Chic Corduroy Bag", description: "100% Organic Cotton Canvas", price: 65.0, quantity: 6 },
      { id: 12, imageUrl: "Product5.jpg", name: "Eco Cedar Bag", description: "100% Organic Cotton Cedar", price: 65.0, quantity: 7 },
       { id: 13, imageUrl: "Product9.jpg", name: "Seaside Linen Bag", description: "100% Organic Cotton Linen", price: 70.0, quantity: 7 },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        paddingBottom: "120px",
        boxSizing: "border-box",
        backgroundColor: "#f8f9fa",
        paddingTop: "80px",
      }}
    >
      {hasCartItems && (
  <button
    className="btn btn-outline-secondary mb-3 align-self-start"
    onClick={() => navigate('/store')}
  >
    ← Store
  </button>
)}

      <h2
        className="text-center my-4"
        style={{
          fontFamily: "Georgia, serif",
          textAlign: "center",
        }}
      >
        🛒 Shopping Cart
      </h2>

     {cartItems.length === 0 ? (
  <>
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        Your cart is empty.
      </p>
      <button
        onClick={handleShopNow}
        style={{
          padding: "12px 25px",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Shop Now
      </button>
    </div>
    <div style={{ marginTop: "40px" }}>
      <h3>Recommended for you</h3>
      <div className="row g-3 justify-content-center">
        {recommendedProducts.map((prod) => (
          <div key={prod.id} className="col-md-4">
            <div
              className="card p-3 h-100"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPopupProduct(prod);
                setPopupVisible(true);
              }}
            >
              <img
                src={`/${prod.imageUrl}`}
                alt={prod.name}
                className="img-fluid"
                style={{
                  borderRadius: "6px",
                  marginBottom: "8px",
                  objectFit: "cover",
                  height: "600px",
                  width: "100%",
                }}
              />
              <p style={{ fontWeight: "600", fontSize: "16px" }}>{prod.name}</p>
              <p
                style={{ fontSize: "14px", color: "#555", marginBottom: "4px" }}
              >
                {prod.description}
              </p>
              <p style={{ color: "#007bff", fontWeight: "bold" }}>
                {prod.price.toFixed(2)}€
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
) : (
  <>
    {cartItems.map((item, index) => (
      <CartItem
        key={index}
        item={item}
        onRemove={handleRemove}
        onQuantityChange={handleQuantityChange}
      />
    ))}
    <hr />
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "white",
        borderTop: "1px solid #ddd",
        padding: "10px 20px",
        boxSizing: "border-box",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          marginBottom: "8px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#004085",
        }}
      >
        Total: {totalPrice.toFixed(2)}€
      </div>
      <button
        onClick={handleCheckout}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Checkout
      </button>
    </div>
  </>
)}

    {popupVisible && popupProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setPopupVisible(false)} 
        >
          <div
            onClick={(e) => e.stopPropagation()} 
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <img
              src={`/${popupProduct.imageUrl}`}
              alt={popupProduct.name}
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "contain",   
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
              }}
            />
            <h3 style={{ marginTop: "15px" }}>{popupProduct.name}</h3>
            <p>{popupProduct.description}</p>
            <p style={{ fontWeight: "bold", color: "#007bff" }}>
              {popupProduct.price.toFixed(2)}€
            </p>
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
  <button
    onClick={() => setPopupQuantity(q => Math.max(1, q - 1))}
    style={{
      padding: '8px 12px',
      fontSize: '18px',
      marginRight: '10px',
      cursor: 'pointer',
      backgroundColor: '#bfbfbf',
      border: 'none',
      borderRadius: '4px'
    }}
  >
    -
  </button>
  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#999' }}>{popupQuantity}</span>
  <button
    onClick={() => setPopupQuantity(q => q + 1)}
    style={{
      padding: '8px 12px',
      fontSize: '18px',
      marginLeft: '10px',
      cursor: 'pointer',
      backgroundColor: '#bfbfbf',
      border: 'none',
      borderRadius: '4px'
    }}
  >
    +
  </button>
</div>

            <button
              onClick={() => addToCart(popupProduct, popupQuantity)}
              style={{
                marginTop: "15px",
                padding: "12px 25px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;