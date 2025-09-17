import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

export default function ProtectedRoute({ children, role }) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) return null; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = getRole(user);

  if (role && !userRole) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }


  return children;
}

