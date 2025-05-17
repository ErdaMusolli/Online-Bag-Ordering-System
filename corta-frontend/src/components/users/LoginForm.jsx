import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5197/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setSuccess('Login successful!');
        setError('');

       setTimeout(() => {
       window.location.href = "/";
       }, 1000);

      } else {
        const res = await response.text();
        setError(res || 'Login failed');
        setSuccess('');
      }
    } catch {
      setError('Server error or backend not reachable');
    }
  };

  return (
   <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
     <div className="row w-75 shadow rounded overflow-hidden d-flex mt-4">
        <div className="col-md-6 p-0">
          <img src="/loginpic.jpg" alt="Login Visual" className="img-fluid h-100 w-100 object-fit-cover" />
        </div>
     <div className="col-md-6 bg-light p-5">

          <h2 className="mb-4 text-center fw-bold">Log In</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email Address</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success w-100">Log In</button>

            <div className="text-center mt-3">
              <a href="#">Forgot password?</a><br />
              <a href="/register">Don't have an account? Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
