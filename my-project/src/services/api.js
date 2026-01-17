import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL + '/api'

});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
// ad
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;
