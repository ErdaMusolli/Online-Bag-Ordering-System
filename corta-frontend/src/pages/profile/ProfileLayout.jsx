import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div
      style={{
        display:'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        width: '100%',  
        overflowX: 'hidden', 
        boxSizing: 'border-box',
        paddingTop: '50px',
         
      }}
    >
       <div style={{ display: 'flex', width: '100%', padding: '40px 20px ',boxSizing: 'border-box' }}>
        <div className="d-flex" style={{ padding: '20px 0' }}>
          <div
            className="me-4"
            style={{ width: '250px', borderRight: '1px solid #ccc' }}
          >
            <h5 className="mb-4">My Profile</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink className="nav-link" to="personal-data">
                  👤 Personal Data
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="orders">
                  📦 Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="wishlist">
                  ❤️ Wishlist
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="change-password">
                  🔑 Change Password
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="ratings">
                  ⭐ Ratings
                </NavLink>
              </li>
            </ul>
          </div>

           <div style={{ flex: 1, paddingLeft: '20px', minWidth: 0 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;