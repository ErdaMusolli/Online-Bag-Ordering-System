import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ProductList from './components/products/ProductList';
import ProductItem from './components/products/ProductItem';
import ProductForm from './components/products/ProductForm';
import ContactForm from './components/ContactForm/ContactForm';
import Store from "./pages/Store";
import DashboardUser from './pages/DashboardUser';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ContactPage from './pages/ContactPage';

function App() {
  return (
     
    <Router>
      <Navbar/>
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductForm />} />
        <Route path="/product/" element={<ProductItem />} />
        <Route path="/store" element={<Store />} />
        <Route path="/dashboard" element={<DashboardUser />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;