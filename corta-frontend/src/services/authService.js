import api from "./apiClient";

const LOGOUT_FLAG = "corta_logged_out";
const HAS_REFRESH = "corta_has_refresh";

export async function login(email, password) {
  await api.post("/auth/login", { email, password });
  localStorage.setItem(HAS_REFRESH, "1");
  localStorage.removeItem(LOGOUT_FLAG); 
}

let inflightRefresh = null;
export async function tryRefreshOnBoot() {
  if (localStorage.getItem("corta_has_refresh") !== "1") return false;
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    try {
      await api.post("/auth/refresh"); 
      return true;
    } catch {
      localStorage.removeItem("corta_has_refresh");
      return false;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
}

export async function logout() {
  try {
    await api.post("/auth/logout"); 
  } finally {
    localStorage.setItem(LOGOUT_FLAG, "1");
    localStorage.removeItem(HAS_REFRESH);
    document.cookie = "csrf-token=; Max-Age=0; path=/; samesite=None; secure";
  }
}
