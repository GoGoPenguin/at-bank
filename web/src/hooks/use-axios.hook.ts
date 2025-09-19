import axios from "axios";
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

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            break;
          case 400:
            handleAlert(error.response.data.error, "error");
            break;
          case 401:
            if (error.config.url !== "/api/refresh-token") {
              instance
                .post("/api/refresh-token")
                .then(() => {
                  instance(error.config);
                })
                .catch(() => {
                  navigate("/sign-in", { replace: true });
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
    }
  );

  return instance;
};

export default useAxios;
