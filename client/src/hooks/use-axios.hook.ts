import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../context/alert.context";

const useAxios = () => {
  const navigate = useNavigate();
  const { handleAlert } = useContext(AlertContext);
  // Create a memoized Axios instance so it's not recreated on every render
  const instance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      withXSRFToken: true,
    });
  }, []);

  instance.interceptors.request.use((config) => {
    // NOTE: If the request data or params is an object or array, decamelize its keys
    if (config.data) {
      config.data = decamelizeKeys(config.data);
    }
    if (config.params) {
      config.params = decamelizeKeys(config.params);
    }

    if (config.url === "/api/auth/refresh-token") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    } else {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // NOTE: If the response data is an object or array, camelize its keys
      if (response.data && typeof response.data === "object") {
        return {
          ...response,
          data: camelizeKeys(response.data),
        };
      }
      return response;
    },
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            break;
          case 400:
            handleAlert(error.response.data.error, "error");
            break;
          case 401:
            if (error.config.url === "/api/auth/refresh-token") {
              navigate("/sign-in", { replace: true });
              return Promise.reject(error);
            } else if (error.config.url === "/api/auth/sign-in") {
              handleAlert("invalidAccountOrPassword", "error");
            } else {
              return instance
                .put("/api/auth/refresh-token")
                .then(() => {
                  return instance(error.config);
                })
                .catch(() => {
                  navigate("/sign-in", { replace: true });
                  return Promise.reject(error);
                });
            }
            return false;
          case 403:
            return false;
          case 404:
            return false;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default useAxios;
