import axios from "axios";
import { toast } from "react-hot-toast";

export const axiosInstance = axios.create({
  withCredentials: true,
});

let sessionExpiredToastShown = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthAction =
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/sendotp");

      if (!isAuthAction) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (
          !sessionExpiredToastShown &&
          !window.location.pathname.includes("/login")
        ) {
          sessionExpiredToastShown = true;
          toast.error("Your session has expired. Please log in again.");
          setTimeout(() => {
            sessionExpiredToastShown = false;
            window.location.href = "/login";
          }, 1200);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  const rawToken = localStorage.getItem("token");

  let authHeader = {};
  if (rawToken && rawToken !== "null" && rawToken !== "undefined") {
    let cleanToken = rawToken;
    try {
      cleanToken = JSON.parse(rawToken);
    } catch {
      cleanToken = rawToken;
    }
    if (typeof cleanToken === "string") {
      cleanToken = cleanToken.trim().replace(/^"(.*)"$/, "$1");
    }
    if (cleanToken && cleanToken !== "null" && cleanToken !== "undefined") {
      authHeader = {
        Authorization: `Bearer ${cleanToken}`,
      };
    }
  }

  const finalHeaders = {
    ...authHeader,
    ...headers,
  };

  return axiosInstance({
    method,
    url,
    data: bodyData,
    params,
    headers: finalHeaders,
  });
};
