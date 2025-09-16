import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { authFetch } from '../services/authFetch';
import { getNewAccessToken } from '../services/tokenUtils';

const ManagePurchases = () => {
  const navigate = useNavigate(); 
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-secondary text-white',
      'Ready': 'bg-warning text-dark',
      'Completed': 'bg-success text-white',
      'Cancelled': 'bg-danger text-white',
    };
    return (
      <span className={`badge ${statusColors[status] || 'bg-secondary'} px-3 py-2`}>
        {status}
      </span>
    );
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      let token = localStorage.getItem('token');
      if (!token) token = await getNewAccessToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const res = await authFetch('http://localhost:5197/api/purchase', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch purchases');
        const data = await res.json();

        const normalizedPurchases = Array.isArray(data.$values) ? data.$values : data;

        normalizedPurchases.forEach(p => {
          p.purchaseItems = Array.isArray(p.purchaseItems)
            ? p.purchaseItems
            : p.purchaseItems?.$values || [];

          p.purchaseItems.forEach(item => {
            if (!item.productImageUrl) {
              item.productImageUrl = '/default-product.jpg';
            } else if (!item.productImageUrl.startsWith('http')) {
              item.productImageUrl = `http://localhost:5197${item.productImageUrl}`;
            }
          });

          if (!p.status) p.status = 'Pending';
        });

        setPurchases(normalizedPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [navigate]);

  const handleStatusChange = async (purchaseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://localhost:5197/api/purchase/${purchaseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStatus),
      });

      if (res.ok) {
        setPurchases(prev =>
          prev.map(p => (p.id === purchaseId ? { ...p, status: newStatus } : p))
        );
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredPurchases = purchases
    .filter(p => p.userId.toString().includes(searchTerm.trim()))
    .filter(p => p.status !== 'Completed' && p.status !== 'Cancelled');

  return (
    <div style={{ minHeight: '100vh', padding: '20px', paddingTop: '80px', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
      <button className="btn btn-outline-secondary mb-3 align-self-start" onClick={() => navigate('/admin')}>← Back</button>

      <h2 className="text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>🛒 Manage Purchases</h2>

      <div className="w-100" style={{ maxWidth: '1400px' }}>
        <div className="row mb-3 g-2">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover bg-white rounded shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>User ID</th>
                  <th>Created At</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>City</th>
                  <th>Neighborhood</th>
                  <th>Street</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) =>
                    purchase.purchaseItems.length > 0 ? (
                      purchase.purchaseItems.map((item, idx) => (
                        <tr key={`${purchase.id}-${idx}`}>
                          {idx === 0 && (
                            <>
                              <td rowSpan={purchase.purchaseItems.length}>{purchase.userId}</td>
                              <td rowSpan={purchase.purchaseItems.length}>{new Date(purchase.createdAt).toLocaleString()}</td>
                            </>
                          )}
                          <td>
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              onError={(e) => { e.target.onerror = null; e.target.src = "/default-product.jpg"; }}
                              style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                          </td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>

                          {idx === 0 && (
                            <>
                              <td rowSpan={purchase.purchaseItems.length}>{purchase.purchaseItems[0]?.city || '-'}</td>
                              <td rowSpan={purchase.purchaseItems.length}>{purchase.purchaseItems[0]?.neighborhood || '-'}</td>
                              <td rowSpan={purchase.purchaseItems.length}>{purchase.purchaseItems[0]?.street || '-'}</td>
                              <td rowSpan={purchase.purchaseItems.length}>{purchase.purchaseItems[0]?.phoneNumber || '-'}</td>
                              <td rowSpan={purchase.purchaseItems.length}>${purchase.totalAmount.toFixed(2)}</td>
                              <td rowSpan={purchase.purchaseItems.length}>{getStatusBadge(purchase.status)}</td>
                              <td rowSpan={purchase.purchaseItems.length}>
                                <select
                                  className="form-select"
                                  value={purchase.status}
                                  onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Ready">Ready</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr key={purchase.id}>
                        <td>{purchase.userId}</td>
                        <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                        <td>
                          <img
                            src="/default-product.jpg"
                            alt="Product"
                            style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                          />
                        </td>
                        <td colSpan="2"><i>No items</i></td>
                        <td colSpan="4">-</td>
                        <td>${purchase.totalAmount.toFixed(2)}</td>
                        <td>{getStatusBadge(purchase.status)}</td>
                        <td>
                          <select
                            className="form-select"
                            value={purchase.status}
                            onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">No purchases found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePurchases;













