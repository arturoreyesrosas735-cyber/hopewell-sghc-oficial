import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("sghc_token");

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("sghc_token");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  },
);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403) return "No tiene permisos para realizar esta acción.";
    if (status === 404) return "Recurso no encontrado.";
    if (status === 400 && message) return String(message);
    if (status === 500) return fallback;
  }

  return fallback;
};

export const getApiFieldErrors = (error: unknown): Record<string, string[]> => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.errors ?? {};
  }

  return {};
};

export default api;
