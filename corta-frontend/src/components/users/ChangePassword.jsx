import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/apiClient';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword.length < 8) {
      setMessage('New password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setMessage('New password must include at least one uppercase letter');
      return;
    }

    if (!/\d/.test(newPassword)) {
      setMessage('New password must include at least one number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      const res = await api.post('/auth/change-password', formData);
      if (res.status === 200) {
        setMessage('Password changed successfully.');
        navigate('/login');
      }
    } catch (err) {
      const txt = err?.response?.data || 'Something went wrong.';
      setMessage(`Failed: ${txt}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', 
        minHeight: '100vh',
        padding: '100px 150px',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div style={{ width: '500px' }}>
        <div className="card p-4 shadow-sm">
          <h2 className="mb-4 text-center">Change Password</h2>

          {message && (
            <div
              className={`alert ${
                message.startsWith('Failed') ? 'alert-danger' : 'alert-success'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-control"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
