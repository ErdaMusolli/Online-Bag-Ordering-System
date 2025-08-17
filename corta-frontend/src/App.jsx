import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { CartProvider } from './context/CartContext';

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  const [products, setProducts] = useState([]);
 

  useEffect(() => {
  fetch("http://localhost:5197/api/products")
    .then(res => res.json())
    .then(setProducts)
    .catch(console.error);
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
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<PersonalData />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/manage-purchases" element={<ManagePurchases />} />
        <Route path="/manage-news" element={<ManageNews />} />
        <Route path="/view-contact" element={<ViewContacts />} />
        <Route path="/view-reviews" element={<ViewReviews />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/refund" element={<RefundPolicy />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}