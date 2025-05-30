import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutButton from './LogoutButton';
import UserMenu from '../shared/UserMenu'; 

const Navbar = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

   const closeNavbar = () => {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      const bsCollapse = new window.bootstrap.Collapse(navbar, {
        toggle: false
      });
      bsCollapse.hide();
    }
  };
  
  
    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid px-4">
        <div className="navbar-brand title">CORTA</div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center mt-3 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeNavbar}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/store" onClick={closeNavbar}>Store</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={closeNavbar}>ContactUs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/news" onClick={closeNavbar}>News</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="btn btn-outline-dark" onClick={closeNavbar}>Cart</Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <UserMenu />
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-outline-dark" onClick={closeNavbar}>Sign up</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-outline-dark" onClick={closeNavbar}>Log in</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;