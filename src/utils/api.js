import axios from 'axios';

// Create a new instance of axios
const api = axios.create({
  baseURL: 'https://kmrl-doc-system-backend.onrender.com/api', // The base URL for all our API calls
});

// IMPORTANT: This is an interceptor. It runs BEFORE each request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the user info from local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // If the token exists, add it to the Authorization header
    if (userInfo && userInfo.token) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;