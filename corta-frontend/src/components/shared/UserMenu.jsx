import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserMenu = () => {
  const iconStyle = { marginRight: '8px', fontSize: '1.1rem', verticalAlign: 'middle' };

  const navigate = useNavigate();
  const [email, setEmail] = useState('');

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);  
      setEmail(
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        ''
      );
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }
}, []);

   const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    try {
      await fetch('http://localhost:5197/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch (error) {
      console.error('Failed to logout from server:', error);
    }
  }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };
  

 return (
  <div className="dropdown" style={{ position: 'relative' }}>
<button
  className="btn btn-outline-dark dropdown-toggle rounded-circle"
  style={{ width: '40px', height: '40px', textAlign: 'center', padding: 0 }}
  type="button"
  id="userMenuDropdown"
  data-bs-toggle="dropdown"
  aria-expanded="false"
>
  {email ? email.charAt(0).toUpperCase() : 'U'}
</button>
<ul
    className="dropdown-menu dropdown-menu-end"
    aria-labelledby="userMenuDropdown"
    style={{ marginTop: '8px' }}
  >
  <li>
    <span className="dropdown-item-text" style={{ fontWeight: 'bold', color: 'gray' }}>
      {email}
    </span>
  </li>
  <li><hr className="dropdown-divider" /></li>
   <li><Link className="dropdown-item" to="/profile">
            <i className="bi bi-person-fill" style={iconStyle} /> Personal Data
          </Link></li>
    <hr />
   <li><Link className="dropdown-item" to="/profile/orders">
            <i className="bi bi-bag-fill" style={iconStyle} /> Orders
          </Link></li>
  <li><Link className="dropdown-item" to="/profile/wishlist">
            <i className="bi bi-heart-fill" style={iconStyle} /> Wishlist
          </Link></li>
   <hr />
  <li><button className="dropdown-item" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" style={iconStyle} /> Logout
          </button></li>
</ul>

</div>
   
  );
};

export default UserMenu;