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
import Cart from './pages/Cart';
import NewsList from './components/news/NewsList';
import News1 from "./components/news/News1";
import News2 from "./components/news/News2";
import News3 from "./components/news/News3";
import News4 from "./components/news/News4";
import News5 from "./components/news/News5";

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/1" element={<News1 />} />
        <Route path="/news/2" element={<News2 />} />
        <Route path="/news/3" element={<News3 />} />
        <Route path="/news/4" element={<News4 />} />
        <Route path="/news/5" element={<News5 />} />

      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;