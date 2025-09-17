import React, { useState, useEffect } from 'react';
import { tryRefreshOnBoot } from './services/authService';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import api from './services/apiClient'; 
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Store from "./pages/Store";
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ContactPage from './pages/ContactPage';
import ProfileLayout from './pages/profile/ProfileLayout';
import PersonalData from './pages/profile/PersonalData';
import Orders from './pages/profile/Orders';
import OrderDetails from './pages/profile/OrderDetails';
import Wishlist from './pages/profile/Wishlist';
import Ratings from './pages/profile/Ratings';
import ChangePassword from './components/users/ChangePassword';
import DashboardAdmin from './admin/DashboardAdmin';
import ManageUsers from './admin/ManageUsers';
import ManageProducts from './admin/ManageProducts';
import ManagePurchases from './admin/ManagePurchases';
import ManageNews from "./admin/ManageNews";
import ViewContacts from "./admin/ViewContacts";
import ViewReviews from "./admin/ViewReviews";
import NewsList from './components/news/NewsList';
import News1 from "./components/news/News1";
import News2 from "./components/news/News2";
import News3 from "./components/news/News3";
import News4 from "./components/news/News4";
import News5 from "./components/news/News5";
import PrivacyPolicy from './components/ContactForm/PrivacyPolicy';
import TermsAndConditions from './components/ContactForm/TermsAndConditions';
import RefundPolicy from './components/ContactForm/RefundPolicy';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ContactForm from './components/ContactForm/ContactForm';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from "./context/WishlistContext";
import GuestWishlist from "./pages/GuestWishlist";
import ShippingInfo from "./pages/faq/ShippingInfo";
import Returns from "./pages/faq/Returns";
import PaymentMethods from "./pages/faq/PaymentMethods";
import { GuestWishlistProvider } from './context/GuestWishlistContext';
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [user, setUser] = useState(null);                       
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);

 const WishlistWrapper = () => {
    if (!authReady) return null;       
    if (!isAuthenticated) return <Navigate to="/guest-wishlist" replace />;
    return <Wishlist />;
  };

   useEffect(() => {
  (async () => {
    let ok = false;
    try {
      ok = await tryRefreshOnBoot();      
    } catch {}

    if (ok) {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setAuthReady(true);
  })();
}, []);

  const addToCart = (product, quantity = 1, size = "S") => {
    const productToAdd = { ...product, quantity, productId: product.id, size };
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        return [...prev, productToAdd];
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store products={products} />} />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/1" element={<News1 />} />
        <Route path="/news/2" element={<News2 />} />
        <Route path="/news/3" element={<News3 />} />
        <Route path="/news/4" element={<News4 />} />
        <Route path="/news/5" element={<News5 />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PersonalData />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<WishlistWrapper />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

       <Route path="/guest-wishlist" element={<GuestWishlist onAddToCart={addToCart} />}/>
          <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <DashboardAdmin />
      </ProtectedRoute>
    }
  />
  <Route
    path="/manage-users"
    element={
      <ProtectedRoute role="admin">
        <ManageUsers />
      </ProtectedRoute>
    }
  />
  <Route
    path="/manage-products"
    element={
      <ProtectedRoute role="admin">
        <ManageProducts />
      </ProtectedRoute>
    }
  />
  <Route
    path="/manage-purchases"
    element={
      <ProtectedRoute role="admin">
        <ManagePurchases />
      </ProtectedRoute>
    }
  />
  <Route
    path="/manage-news"
    element={
      <ProtectedRoute role="admin">
        <ManageNews />
      </ProtectedRoute>
    }
  />
  <Route
    path="/view-contact"
    element={
      <ProtectedRoute role="admin">
        <ViewContacts />
      </ProtectedRoute>
    }
  />
  <Route
    path="/view-reviews"
    element={
      <ProtectedRoute role="admin">
        <ViewReviews />
      </ProtectedRoute>
    }
  />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
      </Routes>

      {!hideLayout && <Footer onContactClick={() => setShowContactModal(true)} />}

    {showContactModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
  >
    <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "600px", width: "90%" }}>
      <ContactForm onClose={() => setShowContactModal(false)} />
    </div>
  </div>
)}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <GuestWishlistProvider>
        <WishlistProvider>
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </GuestWishlistProvider>
    </CartProvider>
  );
}
