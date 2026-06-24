import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses with refresh support
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (refreshResponse.data?.token) {
            localStorage.setItem('token', refreshResponse.data.token);
            if (refreshResponse.data.refreshToken) {
              localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError.response?.data || refreshError);
        }
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;
