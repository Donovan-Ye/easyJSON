import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { toastErr } from "@/lib/utils";

const unauthorizedWhitelist = ["/auth/get-user-info"];

const innerRequest = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

innerRequest.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  const language = localStorage.getItem("language");
  if (language) {
    config.headers["Accept-Language"] = language;
  }
  return config;
});

innerRequest.interceptors.response.use(
  (response) => {
    if (response.status === 400) {
      toastErr(response?.data?.message);
    }

    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
    }

    if (!unauthorizedWhitelist.includes(error.config.url)) {
      toastErr(error?.response?.data?.message);
    }
    return Promise.reject(error);
  }
);

async function request<T>(config: AxiosRequestConfig) {
  return innerRequest<T>(config).then((res) => res.data);
}

export default request;
