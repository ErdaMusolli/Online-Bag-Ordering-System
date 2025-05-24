import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import DashboardCard from './DashboardCard';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    news: 0, 
    messages: 0,
    purchase: 0,
    reviews:0
  
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (role !== 'admin') {
        navigate('/');
      }
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5197/api/Dashboard/admin-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 w-100">
      <Sidebar />

      <div
        className="flex-grow-1"
        style={{
          paddingLeft: windowWidth >= 768 ? '250px' : '0px',
          paddingTop: '50px',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          width: '100vw'
        }}
      >
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0" style={{ fontFamily: 'Georgia, serif' }}> Dashboard Overview</h2>
            <button className="btn btn-outline-dark" onClick={handleLogout}>Logout</button>
          </div>

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-md-6 col-lg-4">
              <DashboardCard title="Users" total={stats.users} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4">
              <DashboardCard title="Products" total={stats.products} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4">
              <DashboardCard title="News" total={stats.news} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4">
              <DashboardCard title="Messages" total={stats.contact} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4">
              <DashboardCard title="Purchase" total={stats.purchase} />
               </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-4">
             <DashboardCard title="Reviews" total={stats.reviews} />
             </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default DashboardAdmin;

