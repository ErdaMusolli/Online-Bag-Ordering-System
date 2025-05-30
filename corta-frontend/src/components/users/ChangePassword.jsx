import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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


    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5197/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Password changed successfully.');
        navigate('/login');
      } else {
        const err = await res.text();
        setMessage(`Failed: ${err}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div
      className="container-fluid bg-light d-flex justify-content-center align-items-center min-vh-100"
      style={{
        paddingTop: '80px',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
      }}
      
    >
        
        <div className="col-12 col-md-6 bg-white p-4 p-md-5">
          <h2 className="mb-4 text-center fw-bold" style={{ fontFamily: 'Georgia, serif' }}>
            Change Password
          </h2>

          {message && (
            <div className={`alert ${message.startsWith('Failed') ? 'alert-danger' : 'alert-success'}`}>
              {message}
            </div>
          )}

    <form onSubmit={handleSubmit}>
     <div className="mb-3 position-relative">
      <label className="form-label">Current Password</label>
       <input
         type={showCurrentPassword ? "text" : "password"}
         name="currentPassword"
         className="form-control" 
         placeholder="Enter your current password"
         value={formData.currentPassword}
         onChange={handleChange}
         required
       />
</div>


   <div className="mb-3 position-relative">
     <label className="form-label">New Password</label>
       <input
       type={showNewPassword ? "text" : "password"}
       name="newPassword"
       className="form-control"
       placeholder="Enter your new password"
       value={formData.newPassword}
       onChange={handleChange}
       required
       />
</div>


   <div className="mb-3 position-relative">
     <label className="form-label">Confirm New Password</label>
      <input
       type={showConfirmPassword ? "text" : "password"}
       name="confirmPassword"
       className="form-control"
       placeholder="Re-enter your new password"
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
  );
};

export default ChangePassword;

