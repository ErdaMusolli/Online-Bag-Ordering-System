import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserMenu = () => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

 return (
  <div className="dropdown position: fixed">
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
<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
  <li>
    <span className="dropdown-item-text" style={{ fontWeight: 'bold', color: 'gray' }}>
      {email}
    </span>
  </li>
  <li><hr className="dropdown-divider" /></li>
  <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
</ul>

</div>
   
  );
};

export default UserMenu;

