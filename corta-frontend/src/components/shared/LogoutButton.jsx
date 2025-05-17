const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login"); 
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline-dark">
      Logout
    </button>
  );
};

export default LogoutButton;

