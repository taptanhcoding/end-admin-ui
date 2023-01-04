import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosClient.interceptors.request.use(async (config) => {
  // config.headers['Content-Type'] = 'multipart/form-data';
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] =
      "Bearer " + window.localStorage.getItem("token");
  }
  return config;
});

axiosClient.interceptors.response.use(
  async (res) => {
    const { token, refreshToken } = res.data;

    if (token) {
      window.localStorage.setItem("token", token);
    }
    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
    }

    return res.data;
  },
  async (error) => {
    if (error.response.status === 401) {
      const refreshToken = window.localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosClient
          .post("/v1/refresh-token", {
            refreshToken: window.localStorage.getItem("refreshToken"),
          })
          .then((response) => {
            window.localStorage.setItem("token", response.data.token);
            window.localStorage.setItem(
              "refreshToken",
              response.data.refreshToken
            );
          })
          .catch((err) => {
            return Promise.reject(err);
          });
        return axios(error.config);
      }
      return Promise.reject(error);
    }
    console.warn("Error status", error.response.status);
    return Promise.reject(error);
  }
);

export default axiosClient;
