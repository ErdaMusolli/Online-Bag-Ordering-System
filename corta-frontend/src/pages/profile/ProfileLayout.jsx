import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container mt-5">
        <div className="d-flex" style={{ padding: '20px' }}>
          <div className="me-4" style={{ width: '250px', borderRight: '1px solid #ccc' }}>
            <h5 className="mb-4">My Profile</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink className="nav-link" to="personal-data">👤 Personal Data</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="orders">📦 Orders</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="wishlist">❤️ Wishlist</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="change-password">🔑 Change Password</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="ratings">⭐ Ratings</NavLink>
              </li>
            </ul>
          </div>

          <div className="flex-grow-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
