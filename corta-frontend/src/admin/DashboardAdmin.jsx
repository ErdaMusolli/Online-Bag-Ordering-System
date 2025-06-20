import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import DashboardCard from './DashboardCard';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getNewAccessToken } from '../services/tokenUtils';
import { authFetch } from '../services/authFetch';


const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    news: 0, 
    contact: 0,
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
  const checkTokenAndRole = async () => {
    let token = localStorage.getItem('token');

    if (!token) {
      token = await getNewAccessToken(); 
      if (!token) {
        navigate('/login');
        return;
      }
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
  };

  checkTokenAndRole();
}, [navigate]);


  useEffect(() => {
    const fetchStats = async () => {
  try {
    const res = await authFetch('http://localhost:5197/api/dashboard/admin-stats');

    if (!res.ok) {
      console.error("Fetch failed with status:", res.status);
      return;
    }

    const data = await res.json();
    setStats(data);
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err.message);
  }
};
   const tryFetchingWithRefresh = async () => {
    const hasRefreshToken = localStorage.getItem('refreshToken');
    if (!hasRefreshToken) {
      navigate('/login');
      return;
    }

    await fetchStats();
  };

  tryFetchingWithRefresh();
}, []);

  const handleLogout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
    try {
      await fetch("http://localhost:5197/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
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

