import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../services/apiClient";

const API_HOST = "https://localhost:7254"; 

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

const getImgUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/images/")) return `${API_HOST}${url}`;
  return url; 
};
const normalizeNews = (item) => ({
  id: item.id,
  title: item.title,
  content: item.content,
  datePublished: item.datePublished,
  imageUrl: getImgUrl(item.imageUrl),
  source: item.source || "backend",
});

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
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/news");
        const raw = Array.isArray(data) ? data : data?.$values ?? [];
        const backend = raw.map(normalizeNews);

        const merged = [...staticNews.map((s) => ({ ...s, imageUrl: getImgUrl(s.imageUrl) }))];
        backend.forEach((b) => {
          if (!merged.find((n) => n.id === b.id)) merged.push(b);
        });

        if (!cancelled) setNewsItems(merged);
      } catch (err) {
        console.error("Failed to fetch news:", err?.response?.status || err?.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

   const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      await api.delete(`/news/${id}`);
      setNewsItems((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed:", err?.response?.status || err?.message);
      alert("Delete failed");
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
    setEditNewsFile(null);
  };

  const handleUpdate = async () => {
    if (!editingNews) return;
    try {
      const fd = new FormData();
      fd.append("title", editForm.title);
      fd.append("content", editForm.content);
      fd.append("datePublished", editForm.datePublished || "");
      if (editNewsFile) fd.append("image", editNewsFile);

      await api.put(`/news/${editingNews.id}`, fd); 

      const { data } = await api.get("/news");
      const backend = (Array.isArray(data) ? data : data?.$values ?? []).map(normalizeNews);

      const merged = [...staticNews.map((s) => ({ ...s, imageUrl: getImgUrl(s.imageUrl) }))];
      backend.forEach((b) => {
        if (!merged.find((n) => n.id === b.id)) merged.push(b);
      });

      setNewsItems(merged);
      setEditingNews(null);
    } catch (err) {
      console.error("Update failed:", err?.response?.status || err?.message);
      alert("Update failed");
    }
  };

  const handleAdd = async () => {
    if (!newNews.title.trim()) { alert('Title is required'); return; }

     try {
      const fd = new FormData();
      fd.append("title", newNews.title);
      fd.append("content", newNews.content);
      fd.append("datePublished", newNews.datePublished || "");
      if (newNewsFile) fd.append("image", newNewsFile);

      const { data: created } = await api.post("/news", fd);

      const createdNorm = normalizeNews(created || {});
      setNewsItems((prev) => [...prev, createdNorm]);

      setShowAddModal(false);
      setNewNewsFile(null);
      setNewNews({ title: "", content: "", datePublished: "", imageUrl: "" });
    } catch (err) {
      console.error("Add news error:", err?.response?.status || err?.message);
      alert("Adding news failed");
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
