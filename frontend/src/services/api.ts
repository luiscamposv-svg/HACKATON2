import axios from 'axios';
import { API_URL } from '../utils/constants';
import { toCamelCase, toSnakeCase } from '../utils/serialization';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (config.data && typeof config.data === 'object' && !isFormData) {
    config.data = toSnakeCase(config.data);
  }
  if (config.params && typeof config.params === 'object') {
    config.params = toSnakeCase(config.params);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      response.data = toCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.data && typeof error.response.data === 'object') {
      error.response.data = toCamelCase(error.response.data);
    }
    return Promise.reject(error);
  },
);

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
