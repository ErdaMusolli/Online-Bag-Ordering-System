import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { authFetch } from '../services/authFetch';
import { getNewAccessToken } from '../services/tokenUtils';

const ManagePurchases = () => {
  const navigate = useNavigate(); 

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAndFetchPurchases  = async () => {
      let token = localStorage.getItem('token');

      if (!token) {
        token = await getNewAccessToken();
        if (!token) {
          navigate('/login'); 
          return; 
        }
      }
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await authFetch('http://localhost:5197/api/purchase', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch purchases');
        const data = await res.json();

        const normalizedPurchases = Array.isArray(data.$values) ? data.$values : data;

        normalizedPurchases.forEach(p => {
          if (!Array.isArray(p.purchaseItems) && p.purchaseItems?.$values) {
            p.purchaseItems = p.purchaseItems.$values;
          }
          if (!Array.isArray(p.purchaseItems)) {
            p.purchaseItems = [];
          }
          if (!p.status) p.status = 'In Process';
        });

        setPurchases(normalizedPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAndFetchPurchases();
  }, [navigate]);

  const handleStatusChange = async (purchaseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const purchaseToUpdate = purchases.find(p => p.id === purchaseId);
      if (!purchaseToUpdate) return;

      const updatedPurchase = { ...purchaseToUpdate, status: newStatus };

      const res = await fetch(`http://localhost:5197/api/purchase/${purchaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPurchase),
      });

      if (res.ok) {
        setPurchases(purchases.map(p =>
          p.id === purchaseId ? { ...p, status: newStatus } : p
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredPurchases = purchases.filter(p =>
    p.userId.toString().includes(searchTerm.trim())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        paddingTop: '80px',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
      }}
    >
      
      <button
        className="btn btn-outline-secondary mb-3 align-self-start"
        onClick={() => navigate('/admin')}
      >
        ← Back
      </button>

      <h2 className="text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        🛒 Manage Purchases
      </h2>

      <div className="w-100" style={{ maxWidth: '1200px' }}>
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
            <table className="table table-bordered table-hover bg-white rounded shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) =>
                    purchase.purchaseItems.length > 0 ? (
                      purchase.purchaseItems.map((item, idx) => (
                        <tr key={`${purchase.id}-${idx}`}>
                          <td>{idx + 1}</td>
                          <td>{purchase.userId}</td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>${purchase.totalAmount.toFixed(2)}</td>
                          <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                          {idx === 0 && (
                            <td rowSpan={purchase.purchaseItems.length}>
                              <select
                                className="form-select"
                                value={purchase.status}
                                onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                              >
                                <option value="In Process">In Process</option>
                                <option value="Ready">Ready</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr key={purchase.id}>
                        <td>1</td>
                        <td>{purchase.userId}</td>
                        <td colSpan="2"><i>No items</i></td>
                        <td>${purchase.totalAmount.toFixed(2)}</td>
                        <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                        <td>
                          <select
                            className="form-select"
                            value={purchase.status}
                            onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                          >
                            <option value="In Process">In Process</option>
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
                    <td colSpan="7" className="text-center">
                      No purchases found
                    </td>
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




