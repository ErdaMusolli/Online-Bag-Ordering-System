import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', stock: '', imageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', stock: '', imageUrl: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');  
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await fetch('http://localhost:5197/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.$values) ? data.$values : []);
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5197/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({ ...product });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5197/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...editForm } : p)));
        setEditingProduct(null);
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error('Update error', err);
    }
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5197/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10)
        }),
      });

      if (res.ok) {
        const addedProduct = await res.json();
        setProducts([...products, addedProduct]);
        setShowAddModal(false);
      } else {
        alert('Adding product failed');
      }
    } catch (err) {
      console.error('Add product error', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        👜 Manage Products
      </h2>
      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => {
          setNewProduct({ name: '', price: '', description: '', stock: '', imageUrl: '' });
          setShowAddModal(true);
        }}
      >
        ➕ Add New Product
      </button>

      <div className="w-100" style={{ maxWidth: '1000px' }}>
        <div className="row mb-3 g-2">
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name..."
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
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Image</th>
                <th style={{ minWidth: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '50px', height: 'auto', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingProduct && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                {['name', 'price', 'description', 'stock', 'imageUrl'].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                      type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                      className="form-control"
                      value={editForm[field]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
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
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {['name', 'price', 'description', 'stock', 'imageUrl'].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                      type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                      className="form-control"
                      value={newProduct[field]}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;