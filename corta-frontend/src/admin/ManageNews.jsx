import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageNews = () => {
  const navigate = useNavigate();

  const [newsItems, setNewsItems] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', datePublished: '', imageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNews, setNewNews] = useState({ title: '', content: '', datePublished: '', imageUrl: '' });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://localhost:5197/api/news');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();

        const newsArray = data.$values || data;
        const mappedNews = newsArray.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          datePublished: item.datePublished,
          imageUrl: item.imageUrl,
        }));

        setNewsItems(mappedNews);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      const res = await fetch(`http://localhost:5197/api/news/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNewsItems(newsItems.filter(n => n.id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (news) => {
    setEditingNews(news);
    setEditForm({
      title: news.title,
      content: news.content,
      datePublished: news.datePublished,
      imageUrl: news.imageUrl,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5197/api/news/${editingNews.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setNewsItems(newsItems.map(n => n.id === editingNews.id ? { ...n, ...editForm } : n));
        setEditingNews(null);
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    if (!newNews.title.trim()) {
      alert('Title is required');
      return;
    }
    try {
      const res = await fetch('http://localhost:5197/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNews),
      });
      if (res.ok) {
        const addedNews = await res.json();
        setNewsItems([...newsItems, addedNews]);
        setShowAddModal(false);
      } else {
        alert('Adding news failed');
      }
    } catch (error) {
      console.error('Add news error', error);
    }
  };

  const filteredNews = newsItems.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        paddingTop: "80px",
        boxSizing: "border-box",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <button
        className="btn btn-outline-secondary mb-3 align-self-start"
        onClick={() => navigate("/admin")}
      >
        ← Back
      </button>
      <h2 className="text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>
        📰 Manage News
      </h2>

      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => {
          setNewNews({ title: '', content: '', datePublished: '', imageUrl: '' });
          setShowAddModal(true);
        }}
      >
        ➕ Add a News
      </button>

      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search news by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover bg-white rounded shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Content</th>
                <th>Date Published</th>
                <th>Image</th>
                <th style={{ minWidth: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map((news, index) => (
                  <tr key={news.id}>
                    <td>{index + 1}</td>
                    <td>{news.title}</td>
                    <td>{news.content}</td>
                    <td>{new Date(news.datePublished).toLocaleDateString()}</td>
                    <td>
                      {news.imageUrl ? (
                        <img src={news.imageUrl} alt={news.title} style={{ width: '80px', height: 'auto' }} />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => openEditModal(news)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(news.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No news found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingNews && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit News</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingNews(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm({ ...editForm, content: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date Published</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editForm.datePublished.split('T')[0]}
                    onChange={(e) =>
                      setEditForm({ ...editForm, datePublished: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.imageUrl}
                    onChange={(e) =>
                      setEditForm({ ...editForm, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingNews(null)}
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
                <h5 className="modal-title">Add News</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newNews.title}
                    onChange={(e) =>
                      setNewNews({ ...newNews, title: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={newNews.content}
                    onChange={(e) =>
                      setNewNews({ ...newNews, content: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date Published</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newNews.datePublished}
                    onChange={(e) =>
                      setNewNews({ ...newNews, datePublished: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newNews.imageUrl}
                    onChange={(e) =>
                      setNewNews({ ...newNews, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add News
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNews;

