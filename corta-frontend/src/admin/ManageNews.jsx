import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../services/authFetch';
import { getNewAccessToken } from '../services/tokenUtils';

const staticNews = [
  {
    id: 1,
    title: 'New Organic Products Launched',
    content: 'Discover our new range of organic bags crafted sustainably.',
    datePublished: '2025-01-12',
    imageUrl: '/News1.jpg',
  },
  {
    id: 2,
    title: 'Discount for First Orders',
    content: 'Enjoy a special discount for your first purchase.',
    datePublished: '2025-01-10',
    imageUrl: '/News2.jpg',
  },
  {
    id: 3,
    title: 'About Us',
    content: 'Learn more about our mission and eco-friendly products.',
    datePublished: '2025-01-08',
    imageUrl: '/News3.jpg',
  },
  {
    id: 4,
    title: 'New Fall/Winter Collection 2024',
    content: 'Check out our warm and stylish fall/winter collection.',
    datePublished: '2024-10-01',
    imageUrl: '/News4.jpg',
  },
  {
    id: 5,
    title: 'Welcome the Spring Collection 2025!',
    content: 'Fresh colors and floral patterns to brighten your days.',
    datePublished: '2025-05-10',
    imageUrl: '/News5.jpg',
  },
];

const ManageNews = () => {
  const navigate = useNavigate();

  const [newsItems, setNewsItems] = useState(staticNews); 
  const [editingNews, setEditingNews] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', datePublished: '', imageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNews, setNewNews] = useState({ title: '', content: '', datePublished: '', imageUrl: '' });
  const [newNewsFile, setNewNewsFile] = useState(null);
  const [editNewsFile, setEditNewsFile] = useState(null);

  useEffect(() => {
    const fetchBackendNews = async () => {
      let token = localStorage.getItem('token');
      if (!token) {
        token = await getNewAccessToken();
        if (!token) return navigate('/login');
      }

      try {
        const res = await authFetch('http://localhost:5197/api/news');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        const backendNewsArray = data.$values || data;

        const backendNews = backendNewsArray.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          datePublished: item.datePublished,
          imageUrl: item.imageUrl ? `http://localhost:5197${item.imageUrl}` : '',
        }));

        const mergedNews = [...staticNews];
        backendNews.forEach(item => {
          if (!mergedNews.find(n => n.id === item.id)) mergedNews.push(item);
        });

        setNewsItems(mergedNews);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBackendNews();
  }, [navigate]);


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      let token = localStorage.getItem('token');
      if (!token) token = await getNewAccessToken();
      if (!token) return navigate('/login');

      const res = await fetch(`http://localhost:5197/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) setNewsItems(newsItems.filter(n => n.id !== id));
    } catch (error) { console.error(error); }
  };

  // Open edit modal
  const openEditModal = (news) => {
    setEditingNews(news);
    setEditForm({
      title: news.title,
      content: news.content,
      datePublished: news.datePublished,
      imageUrl: news.imageUrl,
    });
    setEditNewsFile(null);
  };

  const handleUpdate = async () => {
    try {
      let token = localStorage.getItem('token');
      if (!token) token = await getNewAccessToken();
      if (!token) return navigate('/login');

      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('content', editForm.content);
      formData.append('datePublished', editForm.datePublished);
      if (editNewsFile) formData.append('image', editNewsFile);

      const res = await fetch(`http://localhost:5197/api/news/${editingNews.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const updatedNewsList = await (await authFetch('http://localhost:5197/api/news')).json();
        setNewsItems(updatedNewsList);
        setEditingNews(null);
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleAdd = async () => {
    if (!newNews.title.trim()) { alert('Title is required'); return; }

    try {
      let token = localStorage.getItem('token');
      if (!token) token = await getNewAccessToken();
      if (!token) return navigate('/login');

      const formData = new FormData();
      formData.append('title', newNews.title);
      formData.append('content', newNews.content);
      formData.append('datePublished', newNews.datePublished);
      if (newNewsFile) formData.append('image', newNewsFile);

      const res = await fetch('http://localhost:5197/api/news', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const addedNews = await res.json();
        setNewsItems([...newsItems, addedNews]);
        setShowAddModal(false);
        setNewNewsFile(null);
      } else alert('Adding news failed');
    } catch (error) {
      console.error('Add news error', error);
    }
  };

  const filteredNews = newsItems.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", padding: "20px", paddingTop: "80px", backgroundColor: "#f8f9fa", display: "flex", flexDirection: "column", alignItems: "center", width: "100vw" }}>
      <button className="btn btn-outline-secondary mb-3 align-self-start" onClick={() => navigate("/admin")}>← Back</button>
      <h2 className="text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>📰 Manage News</h2>

      <button className="btn btn-outline-primary mb-3" onClick={() => { setNewNews({ title: '', content: '', datePublished: '', imageUrl: '' }); setShowAddModal(true); }}>➕ Add a News</button>

      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <input type="text" className="form-control mb-3" placeholder="Search news..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        <div className="table-responsive">
          <table className="table table-bordered table-hover bg-white rounded shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th><th>Title</th><th>Content</th><th>Date</th><th>Image</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? filteredNews.map((news, idx) => (
                <tr key={news.id}>
                  <td>{idx + 1}</td>
                  <td>{news.title}</td>
                  <td>{news.content}</td>
                  <td>{new Date(news.datePublished).toLocaleDateString()}</td>
                  <td>
                    {news.imageUrl ? <img src={news.imageUrl} alt={news.title} style={{ width: '80px', height: 'auto' }} /> : 'No image'}
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => openEditModal(news)}>Edit</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(news.id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="text-center">No news found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <Modal type="add" news={newNews} setNews={setNewNews} file={newNewsFile} setFile={setNewNewsFile} onSave={handleAdd} onClose={() => setShowAddModal(false)} />}
      {editingNews && <Modal type="edit" news={editForm} setNews={setEditForm} file={editNewsFile} setFile={setEditNewsFile} onSave={handleUpdate} onClose={() => setEditingNews(null)} />}
    </div>
  );
};

const Modal = ({ type, news, setNews, file, setFile, onSave, onClose }) => (
  <div className="modal d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content shadow">
        <div className="modal-header">
          <h5 className="modal-title">{type === 'add' ? 'Add News' : 'Edit News'}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <input type="text" className="form-control mb-3" placeholder="Title" value={news.title} onChange={e => setNews({ ...news, title: e.target.value })} />
          <textarea className="form-control mb-3" rows={4} placeholder="Content" value={news.content} onChange={e => setNews({ ...news, content: e.target.value })} />
          <input type="date" className="form-control mb-3" value={news.datePublished.split('T')[0] || ''} onChange={e => setNews({ ...news, datePublished: e.target.value })} />
          <input type="file" className="form-control" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>{type === 'add' ? 'Add News' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  </div>
);

export default ManageNews;
