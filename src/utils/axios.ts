import axios, { AxiosRequestConfig } from 'axios';

// next
import { getSession } from 'next-auth/react';

const baseURL = 'https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Auth/Web API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    }

    // Check if response exists before accessing its properties
    if (!error.response) {
      // Network error without response (timeout, DNS failure, etc.)
      console.error('Network error without response:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.'
      });
    }

    // Now we can safely access error.response.status
    if (error.response.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }

    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.post(url, { ...config });

  return res.data;
};
