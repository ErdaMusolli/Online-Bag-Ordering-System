const LogoutButton = () => {
  const handleLogout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    try {
      await fetch('http://localhost:5197/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  window.location.replace("/login");
};

  return (
    <button onClick={handleLogout} className="btn btn-outline-dark">
      Logout
    </button>
  );
};

export default LogoutButton;

