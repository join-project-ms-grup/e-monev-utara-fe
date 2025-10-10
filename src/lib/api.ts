import axios from "axios"
import Cookies from "js-cookie"
import { SITE_URL } from "./config"
import toast from "react-hot-toast";

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
    if (error.code === 'ECONNREFUSED') {
      toast.error('Tidak bisa terhubung ke server. Pastikan server aktif.');
    }
    if (!error.response) {
      toast.error('Koneksi gagal. Periksa jaringan atau server.');
    }
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/auth";
    }
    if (error.response.status === 500) {
      toast.error('Terjadi kesalahan di server. Silakan coba lagi nanti.')
    }
    return Promise.reject(error);
  }
)

export default api
