import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/token/refresh/`,
          // "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        const newAccess = response.data.access;

        localStorage.setItem("access", newAccess);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;

    
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;