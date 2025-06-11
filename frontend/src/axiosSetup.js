// src/axiosSetup.js
import axios from 'axios';

// ✅ Axios instance with environment-based API URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// ✅ CSRF helper
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

// ✅ Auto-attach CSRF on mutating requests
instance.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;
