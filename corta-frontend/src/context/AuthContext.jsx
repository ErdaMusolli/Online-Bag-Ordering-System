import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/apiClient";
import { tryRefreshOnBoot } from "../services/authService";

const HAS_REFRESH = "corta_has_refresh";

const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  user: null,
  refresh: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const refresh = async () => {
  try {
    const { data } = await api.get("/auth/me", { withCredentials: true });
    const valid =
      data &&
      (
        data.id ||
        data.userId ||
        data.email ||
        data.role ||
        (Array.isArray(data.roles) && data.roles.length > 0) ||
        data.Role ||
        (Array.isArray(data.Roles) && data.Roles.length > 0)
      );
    setUser(valid ? data : null);
    setIsAuthenticated(!!valid);
    return valid ? data : null;
  } catch {
    setUser(null);
    setIsAuthenticated(false);
    return null;
  }
};

  useEffect(() => {
    (async () => {
      try {
        const hadRefresh = localStorage.getItem(HAS_REFRESH) === "1";
        const ok = hadRefresh ? await tryRefreshOnBoot() : false;
        if (ok) {
          await refresh();
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem(HAS_REFRESH);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = useMemo(
    () => ({ isAuthenticated, loading, user, refresh, logout }),
    [isAuthenticated, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
