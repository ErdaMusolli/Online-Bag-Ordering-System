import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const email =
    user?.email ??
    user?.username ??
    user?.name ??
    "";

   const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();               
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const iconStyle = { marginRight: "8px", fontSize: "1.1rem", verticalAlign: "middle" };

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