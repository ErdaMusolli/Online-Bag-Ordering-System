import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService'; 
import { useAuth } from "../../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const getRole = (u) => {
  if (!u) return "";
  const claimsUrl = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  let r =
    u.role ??
    u.Role ??
    u.userRole ??
    u.UserRole ??
    u.roleName ??
    u.RoleName ??
    u[claimsUrl] ??
    u.roles ??
    u.Roles;
  if (Array.isArray(r)) r = r[0];
  return (r || "").toString().toLowerCase();
};

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { refresh, user } = useAuth(); 

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError('');
    setSuccess('');
    setSubmitting(true);

   try {
      await login(formData.email, formData.password);
     
      const me = await refresh();         
      const role = getRole(me ?? user);

      setSuccess("Login successful!");
      navigate(role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data ?? 'Login failed';
      setError(typeof msg === 'string' ? msg : 'Login failed');
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

        <div className="col-md-6 p-0 ">
          <img
            src="/loginpic.jpg"
            alt="Log in Visual"
            className="img-fluid w-100 h-100 object-fit-cover"
            style={{ objectFit: 'cover' }}
          />
        </div>

           <div className="col-12 col-md-6 bg-white p-4 p-md-5">
          <h2 className="mb-4 text-center fw-bold" style={{ fontFamily: 'Georgia, serif' }}>
             Log in
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email Address</label>
              <input type="email" name="email" placeholder='Enter your email' className="form-control" value={formData.email} onChange={handleChange} required />
   </div>
            <div className="mb-3 position-relative">
              <label>Password</label>
              <input
               type={showPassword ? "text" : "password"}
               name="password"
               placeholder="Enter your password"
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
            <button type="submit" className="btn btn-success w-100">Log In</button>

            <div className="text-center mt-3">
              <a href="/register">Don't have an account? Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
   
  );
};

export default LoginForm;
