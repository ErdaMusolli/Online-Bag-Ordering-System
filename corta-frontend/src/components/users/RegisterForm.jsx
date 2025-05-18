import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    const { password } = formData;

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must include at least one uppercase letter');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Password must include at least one number');
      return;
    }

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

        setTimeout(() => {
          setSuccess('');
          navigate('/login');
        }, 1500);
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
    <div
      className="container-fluid bg-light d-flex justify-content-center align-items-center min-vh-100"
      style={{ paddingTop: '80px',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div className="row shadow rounded overflow-hidden w-100" style={{ maxWidth: '700px' }}>
     
        <div className="col-md-6 p-0">
          <img
            src="/signup.jpg"
            alt="Sign Up Visual"
            className="img-fluid w-100 h-100 object-fit-cover"
            style={{ objectFit: 'cover' }}
          />
        </div>

     
        <div className="col-12 col-md-6 bg-white p-4 p-md-5">
          <h2 className="mb-4 text-center fw-bold" style={{ fontFamily: 'Georgia, serif' }}>
             Sign Up
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
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
              <label className="form-label">Email</label>
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
              <label className="form-label">Password</label>
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
              <label className="form-label">Confirm Password</label>
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
              Create Account
            </button>

            <div className="text-center mt-3">
              <a href="/login">Already have an account? <strong>Log in</strong></a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;





