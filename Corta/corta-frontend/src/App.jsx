import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import TestBootstrap from './components/TestBootstrap';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import Store from './components/products/Store';
import Home from './components/products/Home';
import DashboardUser from './components/products/DashboardUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestBootstrap />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />

          <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductForm />} />
        <Route path="/store" element={<Store />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashboardUser />} />
      </Routes>
    </Router>
  );
}

export default App;