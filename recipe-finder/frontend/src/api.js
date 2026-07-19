import axios from "axios";

const TOKEN_KEY = "recipe-finder-token";

let baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
if (!baseURL.endsWith("/")) {
  baseURL += "/";
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  // Strip leading slash to let Axios combine it with baseURL correctly
  if (config.url && config.url.startsWith("/")) {
    config.url = config.url.substring(1);
  }

  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
