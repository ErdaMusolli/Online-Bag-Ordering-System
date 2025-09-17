import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/apiClient"; 

const ViewContacts = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/contactmessages");
      const list = Array.isArray(data?.$values) ? data.$values : Array.isArray(data) ? data : [];
      setMessages(list);
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login", { replace: true });
      console.error("Error fetching messages:", err?.response?.status || err?.message);
    } finally {
      setLoading(false);
    }
  };


 const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/contactmessages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete error:", err?.response?.status || err?.message);
      alert("Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  const filteredMessages = messages.filter((m) =>
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        📨 Contact Messages
      </h2>

      <div className="w-100" style={{ maxWidth: '1000px' }}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredMessages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white rounded shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th style={{ minWidth: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{msg.id}</td>
                    <td>{msg.fullName}</td>
                    <td>{msg.email}</td>
                    <td>
                      {msg.message.length > 50 ? (
                        <span>
                          {msg.message.substring(0, 50)}...
                          <button
                            className="btn btn-link btn-sm"
                            onClick={() => setSelectedMessage(msg)}
                          >
                            View
                          </button>
                        </span>
                      ) : (
                        msg.message
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setReplyMessage(msg);
                            setReplyContent('');
                          }}
                        >
                          Reply
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteMessage(msg.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedMessage && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSelectedMessage(null)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Message Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedMessage(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Full Name:</strong> {selectedMessage.fullName}</p>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  <p><strong>Message:</strong><br />{selectedMessage.message}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {replyMessage && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setReplyMessage(null)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Reply to {replyMessage.email}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setReplyMessage(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setReplyMessage(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      console.log("Reply to", replyMessage.email, ":", replyContent);
                      alert(`Reply to ${replyMessage.email}:\n\n${replyContent}`);
                      setReplyMessage(null);
                    }}
                    disabled={!replyContent.trim()}
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewContacts;

