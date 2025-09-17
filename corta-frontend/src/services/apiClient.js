import axios from "axios";

export const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const raw = document.cookie
    .split("; ")
    .find((x) => x.startsWith("csrf-token="))
    ?.split("=")[1];

   const csrf = raw ? decodeURIComponent(raw) : null; 
  if (csrf) config.headers["X-CSRF-Token"] = csrf;

  return config;
});

let inflightRefresh = null;

async function doRefresh() {
  if (!inflightRefresh) {
    inflightRefresh = api.post("/auth/refresh").finally(() => {
      inflightRefresh = null;
    });
  }
  return inflightRefresh;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const cfg = error?.config;

    if (!cfg || status !== 401) {
      return Promise.reject(error);
    }

    const url = (cfg.url || "").toLowerCase();
    if (url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (cfg.__retried) {
      return Promise.reject(error);
    }
    cfg.__retried = true;

    try {
      await doRefresh();              
      return api.request(cfg);        
    } catch (e) {
      return Promise.reject(error);
    }
  }
);

export default api;
