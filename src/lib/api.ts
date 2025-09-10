import axios from "axios"
import Cookies from "js-cookie"
import { SITE_URL } from "./config"

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

export default api
