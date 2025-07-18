import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutButton from './LogoutButton';
import UserMenu from '../shared/UserMenu';

const Navbar = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
    navigate(`/store?search=${encodeURIComponent(searchTerm.trim())}`);
    closeNavbar();
    }
  };

  const closeNavbar = () => {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      const bsCollapse = new window.bootstrap.Collapse(navbar, { toggle: false });
      bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-medium fixed-top">
      <div className="container-fluid">

       <Link 
  className="navbar-brand ps-5" 
  to="/" 
  onClick={closeNavbar}
  style={{ fontFamily: '"Playfair Display", serif', fontWeight: 500 }}
>
       CORTA
      </Link>

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
          <div className="d-flex w-100 justify-content-between align-items-center">

        <form
  className="ms-auto me-3"
  style={{ maxWidth: '400px', width: '100%' }}
  onSubmit={handleSearch}
>
 <div style={{ position: 'relative' }}>
  <input
    type="search"
    className="form-control rounded-pill ps-4 pe-5"
    style={{ minWidth: '250px' }}
    placeholder="Search products"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <i
    className="bi bi-search"
    style={{
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6c757d',
      pointerEvents: 'none'
    }}
  ></i>
</div>
  <button
    type="submit"
    className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-0 border-0 bg-transparent"
    style={{ zIndex: 10 }}
  >
    
  </button>
</form>
    <ul className="navbar-nav d-flex flex-row align-items-center gap-2 ms-auto">
  <li className="nav-item">
    <Link to="/favorites" className="nav-link" onClick={closeNavbar}>
      <i className="bi bi-heart fs-5"></i>
    </Link>
  </li>

  <li className="nav-item">
    <Link to="/cart" className="nav-link" onClick={closeNavbar}>
      <i className="bi bi-cart fs-5"></i>
    </Link>
  </li>
  <Link to="/news" className="nav-link fw-bold">
  <i className="bi bi-globe me-1"></i> 
</Link>

  {isAuthenticated ? (
    <li className="nav-item dropdown">
      <UserMenu />
    </li>
  ) : (
    <>
      <li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle"
    href="#"
    id="userDropdown"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <i className="bi bi-person fs-5"></i>
  </a>
  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
    <li>
      <Link className="dropdown-item" to="/login" onClick={closeNavbar}>
        Log in
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/register" onClick={closeNavbar}>
        Sign up
      </Link>
    </li>
  </ul>
</li>
    </>
  )}
</ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;