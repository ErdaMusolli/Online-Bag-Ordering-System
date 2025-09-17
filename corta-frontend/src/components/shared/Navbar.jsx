import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutButton from './LogoutButton';
import UserMenu from '../shared/UserMenu';
import { useWishlist } from '../../context/WishlistContext';
import { useGuestWishlist } from '../../context/GuestWishlistContext';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated, user } = useAuth(); 
  const { wishlist: userWishlist } = useWishlist();
  const { wishlist: guestWishlist } = useGuestWishlist();
  const { cartCount } = useCart();

  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const wishlistCount = (isAuthenticated ? userWishlist : guestWishlist)?.length || 0;

   const goWishlist = (e) => {
    e.preventDefault();
    if (!authReady) return;           
    navigate(isAuthenticated ? "/profile/wishlist" : "/guest-wishlist");
    closeNavbar();
  };

  const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
    navigate(`/store?search=${encodeURIComponent(searchTerm.trim())}`);
    closeNavbar();
    }
  };

  const closeNavbar = () => {
    const navbar = document.getElementById('navbarNav');
    if (navbar && window.bootstrap?.Collapse) {
      const bsCollapse = new window.bootstrap.Collapse(navbar, { toggle: false });
      bsCollapse.hide();
    }
  };
  
  return (
    <nav
  className="navbar navbar-expand-lg fixed-top"
  style={{ backgroundColor: "#e0e0e0",  height: "80px" }} 
>
      <div className="container-fluid">
        {isAdmin && (
   <button
    className="btn btn-sm btn-outline-dark me-3"
    onClick={() => { navigate("/admin"); closeNavbar(); }}
  >
    Dashboard
  </button>
)}
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
        pointerEvents: 'none',
      }}
    />
    <button
      type="submit"
      className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-0 border-0 bg-transparent"
      style={{ zIndex: 10 }}
    ></button>
  </div>
</form>

    <ul className="navbar-nav d-flex flex-row align-items-center gap-2 ms-auto">
 <li className="nav-item position-relative">
  <Link
    to={isAuthenticated ? "/profile/wishlist" : "/guest-wishlist"}
    className="nav-link"
    onClick={closeNavbar}
  >
    <i className="bi bi-heart fs-5"></i>
    {(isAuthenticated ? userWishlist.length : guestWishlist.length) > 0 && (
  <span
    className="position-absolute badge rounded-pill bg-danger"
    style={{ fontSize: "0.7rem",top: "2px",right:"-8px"}}
  >
    {isAuthenticated ? userWishlist.length : guestWishlist.length}
  </span>
)}
  </Link>
</li>

 <li className="nav-item position-relative">
  <Link to="/cart" className="nav-link" onClick={closeNavbar}>
    <i className="bi bi-cart fs-5"></i>
    {cartCount > 0 && (
      <span
        className="position-absolute badge rounded-pill bg-danger"
        style={{ fontSize: "0.7rem", top: "2px", right: "-8px" }}
      >
        {cartCount}
      </span>
    )}
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