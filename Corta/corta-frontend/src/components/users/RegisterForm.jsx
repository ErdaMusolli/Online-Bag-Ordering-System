import React, { useState } from 'react';
import signupImage from '../../assets/images/signup.jpg';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log(formData);
  };

return (
  <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div className="d-flex flex-md-row flex-column shadow rounded overflow-hidden bg-white" style={{ maxWidth: '900px', width: '100%' }}>
      
      <div className="w-100 w-md-50">
        <img
          src={signupImage}
          alt="Sign Up"
          className="img-fluid h-100 w-100"
          style={{ objectFit: 'cover', minHeight: '100%' }}
        />
      </div>

      <div className="p-5 d-flex flex-column justify-content-center w-100 w-md-50">
        <h2 className="mb-3 text-center fw-bold">Sign up</h2>
        <p className="text-center text-muted mb-4">Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
      </div>

    </div>
  </div>
);
};

export default RegisterForm;

