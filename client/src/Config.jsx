import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const URL_BASE = process.env.REACT_APP_WEBSITE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const axiosWebsite = axios.create({
  baseURL: URL_BASE,
});

const addInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );
};

addInterceptors(axiosInstance);
addInterceptors(axiosWebsite);
console.log("Admin URL:", BASE_URL);
console.log("Website URL:", URL_BASE);

export const initOffcanvasBackButtonHandler = () => {
  const handlePopState = () => {
    const openOffcanvases = document.querySelectorAll(".offcanvas.show");

    openOffcanvases.forEach((offcanvas) => {
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
      setTimeout(() => {
        const backdrop = document.querySelector(".offcanvas-backdrop");
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove("offcanvas-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, 300);
    });
  };
  window.addEventListener("popstate", handlePopState);
  window.addEventListener("pagehide", () => {
    const backdrop = document.querySelector(".offcanvas-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  });
  window.addEventListener("beforeunload", () => {
    const backdrop = document.querySelector(".offcanvas-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  });
  return () => {
    window.removeEventListener("popstate", handlePopState);
    window.removeEventListener("pagehide", handlePopState);
    window.removeEventListener("beforeunload", handlePopState);
  };
};
const toastFlags = new Map();
let networkErrorToastShown = false;

axiosInstance.interceptors.response.use(
  (response) => {
    const url = response.config.url;
    if (url) {
      toastFlags.delete(url);
    }
    return response;
  },
  (error) => {
    const config = error.config;
    const url = config?.url;

    if (url) {
      if (!toastFlags.has(url)) {
        toastFlags.set(url, true);

        if (error.response) {
          const { status, data } = error.response;

          if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            toast.error(data.message || "Session expired. Please login again.");
            setTimeout(() => {
              window.location.href = "/login";
            }, 3000);
          }
        } else {
          if (!networkErrorToastShown) {
            networkErrorToastShown = true;
            toast.error("Network error! Please check your connection.");
            setTimeout(() => {
              networkErrorToastShown = false;
            }, 3000);
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

const Config = () => {
  return (
    <>
      <p>Base URL: {BASE_URL}</p>
      <p>Base URL: {URL_BASE}</p>
    </>
  );
};

export { axiosInstance, axiosWebsite };
