import { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5197/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'user',
        }),
      });

      if (response.ok) {
        setSuccess('Registration successful!');
        setError('');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
        setSuccess('');
      }
    } catch {
      setError('Server error or backend not reachable');
    }
  };

 return (
 <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
   <div className="row g-0 shadow rounded overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
    
    <div className="col-12 col-lg-6">
      <img
        src="/signuppic.jpeg"
        alt="Signup Visual"
        className="img-fluid h-100 w-100"
        style={{ objectFit: 'cover', minHeight: '100%' }}
      />
    </div>

    <div className="col-12 col-lg-6 bg-light p-5">
      <h2 className="mb-4 text-center fw-bold">Sign Up</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}


          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Sign Up
            </button>

            <div className="text-center mt-3">
              <a href="/login">Already have an account? Log In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;


