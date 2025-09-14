import axios from "axios"
import Cookies from "js-cookie"
import { SITE_URL } from "./config"

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

const api = axios.create({
  baseURL: SITE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
)

export default api
