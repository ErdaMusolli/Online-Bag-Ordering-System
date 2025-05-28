import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductList from './components/products/ProductList';
import ProductItem from './components/products/ProductItem';
import ProductForm from './components/products/ProductForm';
import ContactForm from './components/ContactForm/ContactForm';
import Store from "./pages/Store";
import DashboardAdmin from './admin/DashboardAdmin';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ContactPage from './pages/ContactPage';
import Cart from './pages/Cart';
import NewsList from './components/news/NewsList';
import News1 from "./components/news/News1";
import News2 from "./components/news/News2";
import News3 from "./components/news/News3";
import News4 from "./components/news/News4";
import News5 from "./components/news/News5";
import ManageUsers from './admin/ManageUsers';
import { useEffect } from 'react';
import PrivacyPolicy from './components/ContactForm/PrivacyPolicy';
import TermsAndConditions from './components/ContactForm/TermsAndConditions';
import RefundPolicy from './components/ContactForm/RefundPolicy';
import ViewContacts from "./admin/ViewContacts";
import ViewReviews from "./admin/ViewReviews";
import ManageProducts from './admin/ManageProducts';
import Checkout from './pages/Checkout';
import ManagePurchases from './admin/ManagePurchases';
import ManageNews from "./admin/ManageNews";



function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');
 
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
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductForm />} />
        <Route path="/product/" element={<ProductItem />} />
        <Route path="/store" element={<Store />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/1" element={<News1 />} />
        <Route path="/news/2" element={<News2 />} />
        <Route path="/news/3" element={<News3 />} />
        <Route path="/news/4" element={<News4 />} />
        <Route path="/news/5" element={<News5 />} />
        <Route path="/manage-users" element={<ManageUsers />} />
       <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
       <Route path="/refund" element={<RefundPolicy />} />
      <Route path="/view-contact" element={<ViewContacts />} />
      <Route path="/view-reviews" element={<ViewReviews />} />
       <Route path="/manage-products" element={<ManageProducts />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/manage-purchases" element={<ManagePurchases />} />
      <Route path="/manage-news" element={<ManageNews />} />
      

      </Routes>
 
      {!hideLayout && <Footer />}
    </>
  );
}
 
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
 
export default App;