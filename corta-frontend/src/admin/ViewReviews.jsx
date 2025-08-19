import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../services/authFetch';
import { getNewAccessToken } from '../services/tokenUtils';

const ViewReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviewsAndProducts = async () => {
    let token = localStorage.getItem('token');

    if (!token) {
      token = await getNewAccessToken();
      if (!token) {
        navigate('/login');
        return;
      }
    }

    try {
     
      const reviewsRes = await authFetch('http://localhost:5197/api/reviews');
      if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
      const reviewsData = await reviewsRes.json();
      const reviewsArray = reviewsData.$values || [];

      
      const productsRes = await authFetch('http://localhost:5197/api/products');
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      const productsData = await productsRes.json();
      const productsArray = productsData.$values || [];

      
      const reviewsWithImages = reviewsArray.map((rev) => {
        const product = productsArray.find((p) => p.id === rev.productId);
        return {
          ...rev,
          productImageUrl: product ? product.imageUrl : null,
        };
      });

      setReviews(reviewsWithImages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      let token = localStorage.getItem('token');
      if (!token) {
        token = await getNewAccessToken();
        if (!token) {
          navigate('/login');
          return;
        }
      }

      const res = await fetch(`http://localhost:5197/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    fetchReviewsAndProducts();
  }, []);

  const filteredReviews = reviews.filter((r) =>
    r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
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
        ⭐ View Reviews
      </h2>

      <div className="w-100" style={{ maxWidth: '1000px' }}>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : filteredReviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            <table className="table table-bordered table-hover bg-white rounded shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>ProductImage</th> 
                  <th>Product ID</th>
                  <th>User Email</th>
                  <th>Rating</th>
                  <th>Created At</th>
                  <th style={{ minWidth: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev, index) => (
                  <tr key={rev.id}>
                    <td>{index + 1}</td>
                    <td>
                      {rev.productImageUrl ? (
                        <img
                          src={rev.productImageUrl}
                          alt="Product"
                          style={{
                            width: '50px',
                            height: 'auto',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>{rev.productId}</td>
                    <td>{rev.userEmail}</td>
                    <td>{rev.rating}</td>
                    <td>{new Date(rev.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(rev.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReviews;
