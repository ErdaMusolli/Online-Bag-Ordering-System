import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="navbar-brand title">CORTA</div>
      <div className="ms-auto d-flex gap-3 align-items-center">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/store">Store</Link>
        <Link className="nav-link" to="/contact">ContactUs</Link>
        <Link className="nav-link" to="/news">News</Link>
        <Link to="/signup" className="btn btn-outline-dark">Sign up</Link>
        <Link to="/login" className="btn btn-dark">Log in</Link>
      </div>
    </nav>
  );
};

export default Navbar;