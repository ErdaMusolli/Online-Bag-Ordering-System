import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = ({ onContactClick }) => {
  return (
    <footer
      className="py-4 mt-auto"
      style={{
        backgroundColor: "#e0e0e0",
        color: "#333",
      }}
    >
      <div className="container">
        <div className="row justify-content-center text-start align-items-start">
          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">Policies</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/privacy-policy" className="text-decoration-none text-dark">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-decoration-none text-dark">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-decoration-none text-dark">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">My Profile</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/profile" className="text-decoration-none text-dark">
                  Personal Data
                </Link>
              </li>
              <li>
                <Link to="/profile/orders" className="text-decoration-none text-dark">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/profile/wishlist" className="text-decoration-none text-dark">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">FAQ</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/shipping-info" className="text-decoration-none text-dark">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-decoration-none text-dark">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/payment-methods" className="text-decoration-none text-dark">
                  Payment Methods
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3 text-md-center">
            <h6 className="fw-bold">Socials</h6>
            <a href="https://facebook.com/Corta.clothing" className="text-dark me-3">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://twitter.com/Corta_clothing" className="text-dark me-3">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="https://instagram.com/corta.clothing/" className="text-dark">
              <i className="bi bi-instagram"></i>
            </a>
            <div className="mt-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={onContactClick}
              >
                📬 Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="mb-0">&copy; 2025 CORTA. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
