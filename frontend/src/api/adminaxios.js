import axios from "axios";

const adminAxios = axios.create({
  // baseURL: "http://127.0.0.1:8000",
   baseURL: process.env.REACT_APP_API_URL,
});


adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_access");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);


adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

  
    if (originalRequest.url.includes("/api/token/refresh/")) {
      localStorage.removeItem("admin_access");
      localStorage.removeItem("admin_refresh");
      window.location.href = "/LoginAd";
      return Promise.reject(error);
    }


    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("admin_refresh");

      if (!refreshToken) {
        localStorage.removeItem("admin_access");
        localStorage.removeItem("admin_refresh");
        window.location.href = "/LoginAd";
        return Promise.reject(error);
      }

      try {
        console.log("Refreshing admin token...");

        const res = await axios.post(
          // "http://127.0.0.1:8000/api/token/refresh/",
          `${process.env.REACT_APP_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;

       
        localStorage.setItem("admin_access", newAccess);

        adminAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;


        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return adminAxios(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token expired");

        localStorage.removeItem("admin_access");
        localStorage.removeItem("admin_refresh");
        window.location.href = "/LoginAd";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;