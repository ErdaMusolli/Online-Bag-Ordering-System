import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
  const { clearCart } = useCart();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); 
    } finally {
      clearCart();
      window.location.replace("/login");
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline-dark">
      Logout
    </button>
  );
};

export default LogoutButton;



