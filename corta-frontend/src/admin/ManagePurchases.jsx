import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagePurchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editForm, setEditForm] = useState({
    userId: '',
    totalAmount: '',
    purchaseItems: [],
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5197/api/purchase', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch purchases');
        const data = await res.json();
        console.log('Fetched purchases:', data);
        setPurchases(data.$values || []);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };
    fetchPurchases();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5197/api/purchase/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPurchases(purchases.filter(p => p.id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const openEditModal = (purchase) => {
    setEditingPurchase(purchase);
    setEditForm({
      userId: purchase.userId,
      totalAmount: purchase.totalAmount,
      purchaseItems: purchase.purchaseItems.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5197/api/purchase/${editingPurchase.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setPurchases(purchases.map(p => p.id === editingPurchase.id ? { ...p, ...editForm, id: p.id } : p));
        setEditingPurchase(null);
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error('Update error', err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...editForm.purchaseItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditForm({ ...editForm, purchaseItems: newItems });
  };

  const addPurchaseItem = () => {
    setEditForm({
      ...editForm,
      purchaseItems: [...editForm.purchaseItems, { productName: '', quantity: 1, price: 0 }],
    });
  };

  const removePurchaseItem = (index) => {
    const newItems = [...editForm.purchaseItems];
    newItems.splice(index, 1);
    setEditForm({ ...editForm, purchaseItems: newItems });
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

        <div className="table-responsive">
          <table className="table table-bordered table-hover bg-white rounded shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Created At</th>
                <th>Total Amount</th>
                <th style={{ minWidth: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase, index) => (
                  <tr key={purchase.id}>
                    <td>{index + 1}</td>
                    <td>{purchase.userId}</td>
                    <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                    <td>${purchase.totalAmount.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => openEditModal(purchase)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(purchase.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingPurchase && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit Purchase #{editingPurchase.id}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingPurchase(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.userId}
                    onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editForm.totalAmount}
                    onChange={(e) => setEditForm({ ...editForm, totalAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <hr />
                <h6>Purchase Items</h6>
                {editForm.purchaseItems.map((item, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2">
                    <div className="mb-2">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={item.productName}
                        onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                      />
                    </div>
                    <div className="mb-2 row">
                      <div className="col">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removePurchaseItem(idx)}>
                      Remove Item
                    </button>
                  </div>
                ))}

                <button className="btn btn-outline-primary btn-sm" onClick={addPurchaseItem}>
                  + Add Item
                </button>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingPurchase(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePurchases;

