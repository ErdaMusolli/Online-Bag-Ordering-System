import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        event.target.id !== 'menu-toggle-btn'
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <button
  id="menu-toggle-btn"
  className="btn btn-light border d-md-none position-fixed top-0 start-0 m-3 zindex-tooltip"
  onClick={toggleSidebar}
  style={{ zIndex: 1100 }}
>
  {isOpen ? '✕' : '☰'}
</button>

      <div
        ref={sidebarRef}
        className={`bg-dark text-white p-4 ${isOpen ? 'd-block' : 'd-none'} d-md-block`}
        style={{
          height: '100vh',
          width: '250px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h4 className="text-center mb-4">Admin Dashboard</h4>
        <ul className="nav flex-column gap-3">
          <li className="nav-item"><Link to="/manage-users" className="nav-link text-white">Manage Users</Link></li>
          <li className="nav-item"><Link to="/manage-products" className="nav-link text-white">Manage Products</Link></li>
          <li className="nav-item"><Link to="/manage-news" className="nav-link text-white">Manage News</Link></li>
          <li className="nav-item"><Link to="/view-contact" className="nav-link text-white">View Contact</Link></li>
          <li className="nav-item"><Link to="/manage-purchases" className="nav-link text-white">Manage Purchases</Link></li>
         <Link to="/view-reviews" className="nav-link text-white">View Reviews</Link>

        </ul>
      </div>
    </>
  );
};

export default Sidebar;


