import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/apiClient";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (username.length < 3) return setError("Username must be at least 3 characters");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Invalid email format");
    if (password.length < 8) return setError("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) return setError("Password must include at least one uppercase letter");
    if (!/\d/.test(password)) return setError("Password must include at least one number");
    if (password !== formData.confirmPassword) return setError("Passwords do not match");

    setSubmitting(true);

    try {
     await api.post("/auth/register", { username, email, password });

      setSuccess("Registration successful!");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 1200);
    } catch (err) {
      const msg =
        (typeof err?.response?.data === "string" && err.response.data) ||
        err?.response?.data?.message ||
        err?.message ||
        "Email already exists";
      setError(msg);
    } finally {
      setSubmitting(false);
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
                placeholder="Username"
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
                placeholder="Email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
           <i
             className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
             onClick={() => setShowPassword(!showPassword)}
             style={{
             position: 'absolute',
             right: '10px',
             top: '50%',
             cursor: 'pointer'
           }}
       ></i>
</div>

           <div className="mb-3 position-relative">
              <label className="form-label">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            <i
                className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                cursor: 'pointer'
            }}
      ></i>
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





