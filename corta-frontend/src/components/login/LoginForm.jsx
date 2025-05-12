import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="container mt-5 d-flex justify-content-center">
      <div className="row w-75 shadow rounded bg-light">
        <div className="col-md-6 p-0">
          <img
            src="/assets/scissors.jpg" 
            alt="Corta login visual"
            className="img-fluid h-100 rounded-start"
          />
        </div>
        <div className="col-md-6 p-5">
          <h3 className="mb-4 text-center">Log In</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Log In
            </button>

            <div className="text-center mt-3">
              <a href="#">Forgot password?</a>
              <br />
              <a href="/register">Don't have an account? Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
